const API = "http://localhost:3000/api";
const SHOW_POPULAR_TRIPS = false;


// Official RURA tariff (effective April 6, 2026)
// City of Kigali: 59.28 Frw per passenger per kilometre
const KIGALI_TARIFF_PER_KM = 59.28;
const MINIMUM_FARE = 300;

let stops = [];
let routes = [];
let fares = [];
let gpsLocations = [];

let transitMap = null;
let stopMarkers = [];
let busMarkers = [];
let selectedTripLine = null;
let selectedTripMarkers = [];
let gpsInterval = null;

async function fetchJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request failed: ${url}`);
    }

    return response.json();
}

async function loadData() {
    const [stopsRes, routesRes, faresRes, gpsRes] = await Promise.all([
        fetchJSON(`${API}/stops`),
        fetchJSON(`${API}/routes`),
        fetchJSON(`${API}/fares`),
        fetchJSON(`${API}/gps`).catch(() => [])
    ]);

    stops = stopsRes;
    routes = routesRes;
    fares = faresRes;
    gpsLocations = Array.isArray(gpsRes) ? gpsRes : [];
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadData();

        const originSelect = document.getElementById("originSelect");
        const destSelect = document.getElementById("destSelect");

        if (!originSelect || !destSelect) return;

        stops.forEach((stop, index) => {
            const originOption = new Option(stop.stop_name, stop.stop_id);
            const destinationOption = new Option(stop.stop_name, stop.stop_id);

            originSelect.add(originOption);
            destSelect.add(destinationOption);

            if (index === 0) originOption.selected = true;
            if (index === Math.min(1, stops.length - 1)) destinationOption.selected = true;
        });

        // Hide popular trips if disabled
        if (!SHOW_POPULAR_TRIPS) {
            const quickLinksSection = document.querySelector('.quick-links-section');
            if (quickLinksSection) {
                quickLinksSection.style.display = 'none';
            }
        }

        initializeMap();

        setTimeout(() => {
            if (transitMap) {
                transitMap.invalidateSize(true);
            }

            renderStopMarkers();
            renderBusMarkers();
            updateDashboard();

            // Start live bus tracking
            gpsInterval = setInterval(() => {
                updateLiveGPS();
            }, 5000);

            originSelect.addEventListener("change", updateDashboard);
            destSelect.addEventListener("change", updateDashboard);
        }, 1000);
    } catch (error) {
        console.error(error);

        const fareOutput = document.getElementById("fareOutput");
        const distanceOutput = document.getElementById("distanceOutput");
        const routeNameOutput = document.getElementById("routeNameOutput");

        if (fareOutput) fareOutput.textContent = "Backend unavailable";
        if (distanceOutput) distanceOutput.textContent = "0";
        if (routeNameOutput) routeNameOutput.textContent = "Start the server and import the database";
    }
});

function initializeMap() {
    const mapElement = document.getElementById("transitMap");

    if (!mapElement || typeof L === "undefined") return;

    transitMap = L.map("transitMap", {
        zoomControl: true,
        scrollWheelZoom: true,
        preferCanvas: true
    }).setView([-1.9441, 30.0619], 12);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(transitMap);

    transitMap.whenReady(() => {
        setTimeout(() => {
            transitMap.invalidateSize(true);
        }, 300);
    });

    if (typeof ResizeObserver !== "undefined") {
        const resizeObserver = new ResizeObserver(() => {
            if (transitMap) {
                transitMap.invalidateSize(true);
            }
        });

        resizeObserver.observe(mapElement);
    }

    window.addEventListener("resize", () => {
        if (transitMap) {
            transitMap.invalidateSize(true);
        }
    });
}

function renderStopMarkers() {
    if (!transitMap) return;

    stopMarkers.forEach((marker) => marker.remove());
    stopMarkers = [];

    const validStops = stops.filter(hasValidCoordinates);

    validStops.forEach((stop) => {
        const isTerminal = isTerminalStop(stop);

        const marker = L.circleMarker(
            [Number(stop.latitude), Number(stop.longitude)],
            {
                radius: isTerminal ? 8 : 6,
                color: isTerminal ? "#D12229" : "#080c86",
                fillColor: isTerminal ? "#D12229" : "#080c86",
                fillOpacity: 0.95,
                weight: 3
            }
        )
            .addTo(transitMap)
            .bindPopup(`
                <strong>${stop.stop_name}</strong><br>
                District: ${stop.district || "Unknown"}<br>
                ${isTerminal ? "Terminal stop" : "Bus stop"}
            `);

        stopMarkers.push(marker);
    });

    if (validStops.length > 0) {
        const bounds = L.latLngBounds(
            validStops.map((stop) => [Number(stop.latitude), Number(stop.longitude)])
        );

        transitMap.fitBounds(bounds, {
            padding: [24, 24]
        });
    }
}

function renderBusMarkers() {
    if (!transitMap) return;

    const latestByBus = new Map();

    gpsLocations.forEach((location) => {
        latestByBus.set(location.bus_id, location);
    });


    latestByBus.forEach((location) => {

        if (!hasValidCoordinates(location)) return;


        const position = [
            Number(location.latitude),
            Number(location.longitude)
        ];


        const busIcon = L.divIcon({
            html: "🚌",
            className: "bus-map-icon",
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });


        // If bus marker already exists, move it
        if (busMarkers[location.bus_id]) {

            busMarkers[location.bus_id]
                .setLatLng(position);


            busMarkers[location.bus_id]
                .setPopupContent(`
                    <strong>
                    ${location.bus_number || `Bus ${location.bus_id}`}
                    </strong><br>
                    Speed: ${location.speed || 0} km/h<br>
                    Updated: ${location.recorded_at || "Unknown"}
                `);


        } else {

            // Create marker first time

            const marker = L.marker(
                position,
                {
                    icon: busIcon,
                    zIndexOffset: 900
                }
            )
            .addTo(transitMap)
            .bindPopup(`
                <strong>
                ${location.bus_number || `Bus ${location.bus_id}`}
                </strong><br>
                Speed: ${location.speed || 0} km/h<br>
                Updated: ${location.recorded_at || "Unknown"}
            `);


            busMarkers[location.bus_id] = marker;

        }

    });
}

function updateDashboard() {
    const originSelect = document.getElementById("originSelect");
    const destSelect = document.getElementById("destSelect");

    const fareOutput = document.getElementById("fareOutput");
    const distanceOutput = document.getElementById("distanceOutput");
    const routeNameOutput = document.getElementById("routeNameOutput");
    const timelineContainer = document.getElementById("timelineContainer");
    const firstRunOutput = document.getElementById("firstRunOutput");
    const frequencyOutput = document.getElementById("frequencyOutput");
    const mapPlaceholderText = document.getElementById("mapPlaceholderText");

    if (!originSelect || !destSelect) return;

    const originId = originSelect.value;
    const destId = destSelect.value;

    if (originId === destId) {
        if (fareOutput) fareOutput.textContent = "Pick two different stops";
        if (distanceOutput) distanceOutput.textContent = "0";
        if (routeNameOutput) routeNameOutput.textContent = "Origin and destination must differ";

        if (timelineContainer) {
            timelineContainer.innerHTML = "";
        }

        clearSelectedTripOnMap();

        return;
    }

    const originStop = stops.find((stop) => String(stop.stop_id) === String(originId));
    const destinationStop = stops.find((stop) => String(stop.stop_id) === String(destId));

    if (!originStop || !destinationStop || !hasValidCoordinates(originStop) || !hasValidCoordinates(destinationStop)) {
        if (fareOutput) fareOutput.textContent = "Unavailable";
        if (distanceOutput) distanceOutput.textContent = "0";
        if (routeNameOutput) routeNameOutput.textContent = "Missing stop coordinates";
        clearSelectedTripOnMap();
        return;
    }

    const selectedDistance = calculateDistanceKm(
        Number(originStop.latitude),
        Number(originStop.longitude),
        Number(destinationStop.latitude),
        Number(destinationStop.longitude)
    );

    const selectedFare = calculateFare(selectedDistance);
    const matchingRoute = findMatchingRoute(originStop, destinationStop);

    if (fareOutput) {
        fareOutput.textContent = `${selectedFare} RWF`;
    }

    if (distanceOutput) {
        distanceOutput.textContent = selectedDistance.toFixed(2);
    }

    if (routeNameOutput) {
        routeNameOutput.textContent = matchingRoute
            ? matchingRoute.route_name
            : "Estimated direct trip";
    }

    if (firstRunOutput) {
        firstRunOutput.textContent = "6:00 AM";
    }

    if (frequencyOutput) {
        frequencyOutput.textContent = "15-20 min";
    }

    if (mapPlaceholderText) {
        mapPlaceholderText.textContent = `${originStop.stop_name} → ${destinationStop.stop_name}`;
    }

    if (timelineContainer) {
        timelineContainer.innerHTML = "";

        [originStop.stop_name, destinationStop.stop_name].forEach((name, index) => {
            const item = document.createElement("div");
            item.className = `timeline-node-item ${index === 0 ? "node-active" : ""}`;
            item.innerHTML = `<strong>${name}</strong>`;
            timelineContainer.appendChild(item);
        });
    }

    updateSelectedTripOnMap(originStop, destinationStop);
}

function updateSelectedTripOnMap(originStop, destinationStop) {
    if (!transitMap) return;

    clearSelectedTripOnMap();

    const originLatLng = [
        Number(originStop.latitude),
        Number(originStop.longitude)
    ];

    const destinationLatLng = [
        Number(destinationStop.latitude),
        Number(destinationStop.longitude)
    ];

    transitMap.invalidateSize(true);

    selectedTripLine = L.polyline(
        [originLatLng, destinationLatLng],
        {
            color: "#D12229",
            weight: 7,
            opacity: 1,
            dashArray: null
        }
    ).addTo(transitMap);

    selectedTripLine.bringToFront();

    const originIcon = L.divIcon({
        html: "A",
        className: "selected-stop-icon",
        iconSize: [34, 34],
        iconAnchor: [17, 17]
    });

    const destinationIcon = L.divIcon({
        html: "B",
        className: "selected-stop-icon destination",
        iconSize: [34, 34],
        iconAnchor: [17, 17]
    });

    const originMarker = L.marker(originLatLng, {
        icon: originIcon,
        zIndexOffset: 2000
    })
        .addTo(transitMap)
        .bindPopup(`<strong>Origin</strong><br>${originStop.stop_name}`);

    const destinationMarker = L.marker(destinationLatLng, {
        icon: destinationIcon,
        zIndexOffset: 2000
    })
        .addTo(transitMap)
        .bindPopup(`<strong>Destination</strong><br>${destinationStop.stop_name}`);

    selectedTripMarkers.push(originMarker, destinationMarker);

    const bounds = L.latLngBounds([originLatLng, destinationLatLng]);

    setTimeout(() => {
        transitMap.invalidateSize(true);

        transitMap.fitBounds(bounds, {
            padding: [80, 80],
            maxZoom: 14
        });

        selectedTripLine.bringToFront();
    }, 150);
}

function clearSelectedTripOnMap() {
    if (selectedTripLine) {
        selectedTripLine.remove();
        selectedTripLine = null;
    }

    selectedTripMarkers.forEach((marker) => marker.remove());
    selectedTripMarkers = [];
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return earthRadiusKm * 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );
}

// UPDATED: Official RURA tariff (effective April 6, 2026)
function calculateFare(distanceKm) {
    // City of Kigali: 59.28 Frw per passenger per kilometre
    const calculatedFare = Math.round(distanceKm * KIGALI_TARIFF_PER_KM);

    // Return the higher of calculated or minimum fare
    return Math.max(MINIMUM_FARE, calculatedFare);
}

function toRadians(value) {
    return value * Math.PI / 180;
}

function hasValidCoordinates(item) {
    return (
        item &&
        item.latitude !== null &&
        item.longitude !== null &&
        item.latitude !== undefined &&
        item.longitude !== undefined &&
        !Number.isNaN(Number(item.latitude)) &&
        !Number.isNaN(Number(item.longitude))
    );
}

function isTerminalStop(stop) {
    return stop.is_terminal === true || stop.is_terminal === 1 || stop.is_terminal === "1";
}

function findMatchingRoute(originStop, destinationStop) {
    const originName = originStop.stop_name.toLowerCase();
    const destinationName = destinationStop.stop_name.toLowerCase();

    return routes.find((route) => {
        const routeName = String(route.route_name || "").toLowerCase();
        const startPoint = String(route.start_point || "").toLowerCase();
        const endPoint = String(route.end_point || "").toLowerCase();

        return (
            routeName.includes(originName.split(" ")[0]) &&
            routeName.includes(destinationName.split(" ")[0])
        ) || (
            startPoint.includes(originName.split(" ")[0]) &&
            endPoint.includes(destinationName.split(" ")[0])
        );
    });
}

async function updateLiveGPS() {

    try {

        const gpsRes = await fetchJSON(`${API}/gps`);

        gpsLocations = Array.isArray(gpsRes)
            ? gpsRes
            : [];


        renderBusMarkers();


    } catch(error) {

        console.error(
            "Live GPS update failed:",
            error
        );

    }

}

function selectQuickRoute(originName, destName) {
    const originSelect = document.getElementById("originSelect");
    const destSelect = document.getElementById("destSelect");

    if (!originSelect || !destSelect) return;

    const findOptionValue = (select, name) => {
        const option = Array.from(select.options).find((opt) =>
            opt.text.toLowerCase().includes(name.toLowerCase())
        );

        return option ? option.value : null;
    };

    const originValue = findOptionValue(originSelect, originName);
    const destValue = findOptionValue(destSelect, destName);

    if (originValue) originSelect.value = originValue;
    if (destValue) destSelect.value = destValue;

    updateDashboard();
}