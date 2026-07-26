/**
 * ==========================================================
 * BUS MOVEMENT SIMULATOR
 * ----------------------------------------------------------
 * There is no real GPS hardware on the buses yet, so this
 * script fakes realistic movement instead: each active bus is
 * walked stop-by-stop along the path of an active route, and
 * every few seconds it reports a GPS ping to the API exactly
 * the way a real tracker device would (POST /api/gps).
 *
 * That means no other code has to change - /api/gps, the
 * frontend map, and the socket-less polling all just work,
 * because as far as they're concerned this IS the GPS feed.
 *
 * Toggle with SIMULATE_BUSES=false in .env if you ever wire
 * up real trackers and want to turn this off.
 * ==========================================================
 */

const TICK_MS = Number(process.env.SIM_TICK_MS || 4000);
const AVG_SPEED_KMH = Number(process.env.SIM_AVG_SPEED_KMH || 32); // typical city-bus cruising speed
const SPEED_VARIATION_KMH = 8; // random jitter so buses don't all move in lockstep
const DWELL_TICKS = 1; // brief pause at each stop, like boarding/alighting

function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

class SimulatedBus {
    constructor(busId, path) {
        this.busId = busId;
        this.path = path; // ordered [{ latitude, longitude, stop_name }, ...]
        this.segmentIndex = 0; // stop we're travelling FROM
        this.direction = 1; // 1 = forward along the path, -1 = looping back
        this.dwellTicks = 0;

        // Stagger buses along their route so a demo doesn't show every
        // bus bunched up at the terminal at the same time.
        this.segmentProgress = Math.random();
        if (path.length > 1) {
            this.segmentIndex = Math.floor(Math.random() * (path.length - 1));
        }
    }

    currentLatLng() {
        const from = this.path[this.segmentIndex];
        const to = this.path[this.segmentIndex + this.direction] || from;

        return {
            latitude: lerp(Number(from.latitude), Number(to.latitude), this.segmentProgress),
            longitude: lerp(Number(from.longitude), Number(to.longitude), this.segmentProgress)
        };
    }

    /** Move the bus forward by `deltaSeconds` and return { latitude, longitude, speed }. */
    advance(deltaSeconds) {
        if (this.path.length < 2) {
            return { ...this.currentLatLng(), speed: 0 };
        }

        if (this.dwellTicks > 0) {
            this.dwellTicks -= 1;
            return { ...this.currentLatLng(), speed: 0 };
        }

        const from = this.path[this.segmentIndex];
        const to = this.path[this.segmentIndex + this.direction];

        const segmentKm = Math.max(
            haversineKm(Number(from.latitude), Number(from.longitude), Number(to.latitude), Number(to.longitude)),
            0.05
        );

        const speedKmh = Math.max(
            AVG_SPEED_KMH + (Math.random() * 2 - 1) * SPEED_VARIATION_KMH,
            8
        );

        const kmThisTick = (speedKmh * deltaSeconds) / 3600;
        this.segmentProgress += kmThisTick / segmentKm;

        if (this.segmentProgress >= 1) {
            this.segmentProgress = 0;
            this.segmentIndex += this.direction;
            this.dwellTicks = DWELL_TICKS;

            const nextIndex = this.segmentIndex + this.direction;
            const atTerminus = nextIndex < 0 || nextIndex >= this.path.length;
            if (atTerminus) this.direction *= -1; // reached the end of the line, turn around
        }

        return { ...this.currentLatLng(), speed: Math.round(speedKmh * 10) / 10 };
    }
}

async function fetchJSON(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`${options?.method || "GET"} ${url} -> ${res.status}`);
    return res.json();
}

async function buildFleet(apiBase) {
    const [buses, routes] = await Promise.all([
        fetchJSON(`${apiBase}/buses`),
        fetchJSON(`${apiBase}/routes`)
    ]);

    const activeRoutes = routes.filter((route) => (route.status || "Active") === "Active");
    const activeBuses = buses.filter((bus) => (bus.status || "Active") === "Active");

    if (activeRoutes.length === 0 || activeBuses.length === 0) {
        return [];
    }

    const stopsByRoute = new Map();
    const fleet = [];

    for (let i = 0; i < activeBuses.length; i++) {
        const bus = activeBuses[i];
        const route = activeRoutes[i % activeRoutes.length];

        if (!stopsByRoute.has(route.route_id)) {
            stopsByRoute.set(route.route_id, await fetchJSON(`${apiBase}/routes/${route.route_id}/stops`));
        }

        const stops = stopsByRoute.get(route.route_id);
        if (stops.length < 2) continue;

        fleet.push({
            simulatedBus: new SimulatedBus(bus.bus_id, stops),
            route
        });
    }

    return fleet;
}

async function reportPosition(apiBase, busId, position) {
    await fetchJSON(`${apiBase}/gps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            bus_id: busId,
            latitude: Number(position.latitude.toFixed(6)),
            longitude: Number(position.longitude.toFixed(6)),
            speed: position.speed || 0
        })
    });
}

/**
 * Starts the simulation loop. Call this once, after the server is listening.
 * Returns a `stop()` function so it can be torn down (useful in tests).
 */
function start({ port = process.env.PORT || 3000 } = {}) {
    if (process.env.SIMULATE_BUSES === "false") {
        console.log("[simulator] disabled (SIMULATE_BUSES=false)");
        return () => {};
    }

    const apiBase = `http://localhost:${port}/api`;
    let fleet = [];
    let lastTick = Date.now();
    let stopped = false;

    buildFleet(apiBase)
        .then((loaded) => {
            fleet = loaded;
            const routeCount = new Set(fleet.map((entry) => entry.route.route_id)).size;
            console.log(`[simulator] simulating ${fleet.length} bus(es) across ${routeCount} route(s)`);

            if (fleet.length === 0) {
                console.log("[simulator] no active buses/routes with stops found - add some sample data to see movement");
            }
        })
        .catch((err) => {
            console.error("[simulator] could not load buses/routes:", err.message);
        });

    const interval = setInterval(async () => {
        if (stopped || fleet.length === 0) return;

        const now = Date.now();
        const deltaSeconds = (now - lastTick) / 1000;
        lastTick = now;

        for (const { simulatedBus } of fleet) {
            const position = simulatedBus.advance(deltaSeconds);

            try {
                await reportPosition(apiBase, simulatedBus.busId, position);
            } catch (err) {
                console.error(`[simulator] failed to report bus ${simulatedBus.busId}:`, err.message);
            }
        }
    }, TICK_MS);

    console.log(`[simulator] started - reporting fake GPS pings every ${TICK_MS}ms`);

    return () => {
        stopped = true;
        clearInterval(interval);
    };
}

module.exports = { start, SimulatedBus, haversineKm };
