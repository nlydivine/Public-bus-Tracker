const API = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {

    const originSelect = document.getElementById("originSelect");
    const destSelect = document.getElementById("destSelect");

    const fareOutput = document.getElementById("fareOutput");
    const distanceOutput = document.getElementById("distanceOutput");
    const routeNameOutput = document.getElementById("routeNameOutput");

    const timelineContainer = document.getElementById("timelineContainer");

    const busMarker = document.getElementById("liveBusMarker");
    const mapLabel = document.getElementById("mapPlaceholderText");

    let routes = [];
    let buses = [];

    // ============================
    // Load routes and buses
    // ============================
   async function loadData() {

    try {

        console.log("Trying backend:", `${API}/routes`);

        const routesResponse = await fetch(`${API}/routes`);

        routes = await routesResponse.json();

        console.log("Routes received:", routes);

        const busesResponse = await fetch(`${API}/buses`);

        buses = await busesResponse.json();

        console.log("Buses received:", buses);

        populateStops();

    } catch(error) {

        console.error("Backend connection failed:", error);

    }
}
    

    // ============================
    // Load GPS
    // ============================
    async function getGPS() {

        if (buses.length === 0) return;

        const busId = buses[0].bus_id;

        try {

            const response = await fetch(`${API}/gps/${busId}`);

            if (!response.ok) {
                console.log("No GPS found");
                return;
            }

            const gps = await response.json();

            console.log("GPS:", gps);

        } catch (error) {

            console.error("GPS Error:", error);

        }

    }

    // ============================
    // Fill dropdowns
    // ============================
    function populateStops() {

        originSelect.innerHTML = "";
        destSelect.innerHTML = "";

        routes.forEach(route => {

            originSelect.add(
                new Option(route.start_point, route.start_point)
            );

            destSelect.add(
                new Option(route.end_point, route.end_point)
            );

        });

        updateDashboard();

    }

    // ============================
    // Update dashboard
    // ============================
    function updateDashboard() {

        const origin = originSelect.value;
        const destination = destSelect.value;

        const route = routes.find(r =>
            r.start_point === origin &&
            r.end_point === destination
        );

        if (!route) {

            routeNameOutput.textContent = "No Route Found";
            fareOutput.textContent = "0 RWF";
            distanceOutput.textContent = "0";
            timelineContainer.innerHTML = "";

            return;

        }

        routeNameOutput.textContent = route.route_name;

        distanceOutput.textContent = route.distance;

        fareOutput.textContent =
            Math.round(parseFloat(route.distance) * 60) + " RWF";

        timelineContainer.innerHTML = `
            <div class="timeline-node-item node-active">
                <h5>${route.start_point}</h5>
                <p>Origin</p>
            </div>

            <div class="timeline-node-item">
                <h5>${route.end_point}</h5>
                <p>Destination</p>
            </div>
        `;

        if (busMarker) {
            busMarker.classList.add("is-visible");
        }

        if (mapLabel) {
            mapLabel.style.display = "none";
        }

    }

    originSelect.addEventListener("change", updateDashboard);
    destSelect.addEventListener("change", updateDashboard);

    loadData();

    setInterval(getGPS, 5000);

});