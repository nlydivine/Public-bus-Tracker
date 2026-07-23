const API = 'http://localhost:3000/api';
let stops = [];
let routes = [];
let fares = [];

async function loadData() {
    const [stopsRes, routesRes, faresRes] = await Promise.all([
        fetch(`${API}/routes/1/stops`),
        fetch(`${API}/routes`),
        fetch(`${API}/fares`)
    ]);
    stops = await stopsRes.json();
    routes = await routesRes.json();
    fares = await faresRes.json();
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadData();

    const originSelect = document.getElementById("originSelect");
    const destSelect = document.getElementById("destSelect");

    if (!originSelect || !destSelect) return;

    stops.forEach((stop, index) => {
        const opt1 = new Option(stop.stop_name, stop.stop_id, index === 0, index === 0);
        const opt2 = new Option(stop.stop_name, stop.stop_id, index === 4, index === 4);
        originSelect.add(opt1);
        destSelect.add(opt2);
    });

    originSelect.addEventListener("change", updateDashboard);
    destSelect.addEventListener("change", updateDashboard);

    updateDashboard();
});

function updateDashboard() {
    const originId = document.getElementById("originSelect").value;
    const destId = document.getElementById("destSelect").value;

    const fareOutput = document.getElementById("fareOutput");
    const distanceOutput = document.getElementById("distanceOutput");
    const routeNameOutput = document.getElementById("routeNameOutput");

    if (originId === destId) {
        fareOutput.textContent = "Pick two different stops";
        return;
    }

    const fare = fares.find(f => f.route_id == originId || f.route_id == destId);
    if (fare) {
        fareOutput.textContent = `${fare.fare} RWF`;
        distanceOutput.textContent = `${fare.distance} km`;
        routeNameOutput.textContent = fare.route_name;
    }
}

