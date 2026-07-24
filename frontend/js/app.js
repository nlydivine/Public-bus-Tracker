const API = "http://localhost:3000/api";

let stops = [];
let routes = [];
let fares = [];

async function fetchJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request failed: ${url}`);
    }

    return response.json();
}

async function loadData() {
    const [stopsRes, routesRes, faresRes] = await Promise.all([
        fetchJSON(`${API}/routes/1/stops`),
        fetchJSON(`${API}/routes`),
        fetchJSON(`${API}/fares`)
    ]);

    stops = stopsRes;
    routes = routesRes;
    fares = faresRes;
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

        originSelect.addEventListener("change", updateDashboard);
        destSelect.addEventListener("change", updateDashboard);

        updateDashboard();
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
        fareOutput.textContent = "Pick two different stops";
        distanceOutput.textContent = "0";
        routeNameOutput.textContent = "Origin and destination must differ";

        if (timelineContainer) {
            timelineContainer.innerHTML = "";
        }

        return;
    }

    const defaultFare = fares[0];

    if (!defaultFare) {
        fareOutput.textContent = "No fare data";
        distanceOutput.textContent = "0";
        routeNameOutput.textContent = "No route data available";
        return;
    }

    fareOutput.textContent = `${defaultFare.fare} RWF`;
    distanceOutput.textContent = `${defaultFare.distance} km`;
    routeNameOutput.textContent = defaultFare.route_name;

    if (firstRunOutput) {
        firstRunOutput.textContent = "6:00 AM";
    }

    if (frequencyOutput) {
        frequencyOutput.textContent = "15-20 min";
    }

    if (mapPlaceholderText) {
        mapPlaceholderText.textContent = `${originSelect.options[originSelect.selectedIndex].text} → ${destSelect.options[destSelect.selectedIndex].text}`;
    }

    if (timelineContainer) {
        timelineContainer.innerHTML = "";

        const originName = originSelect.options[originSelect.selectedIndex].text;
        const destName = destSelect.options[destSelect.selectedIndex].text;

        [originName, destName].forEach((name, index) => {
            const item = document.createElement("div");
            item.className = `timeline-node-item ${index === 0 ? "node-active" : ""}`;
            item.innerHTML = `<strong>${name}</strong>`;
            timelineContainer.appendChild(item);
        });
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
