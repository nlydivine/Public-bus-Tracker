/**
 using mock data, as backend is not ready yet
 */

const MOCK_TRANSIT_DATA = {
  stops: [
    { id: "nyabugogo", name: "Nyabugogo Bus Station", desc: "Central hub terminal" },
    { id: "kimisagara", name: "Kimisagara Hub", desc: "Local neighborhood connector" },
    { id: "muhima", name: "Muhima Stop", desc: "Intermediary corridor point" },
    { id: "remera", name: "Remera Terminal", desc: "Airport corridor junction" },
    { id: "kacyiru", name: "Kacyiru District Terminal", desc: "Government sector plaza" },
    { id: "kimironko", name: "Kimironko Hub", desc: "Main market connection point" },
    { id: "downtown", name: "Downtown CBD", desc: "Central business district" }
  ],
  routes: [
    {
      id: "r81",
      name: "Route 81",
      longName: "Nyabugogo → Kacyiru",
      firstDeparture: "6:00 AM",
      frequency: "Every 15-20 min",
      stopSequence: ["nyabugogo", "kimisagara", "muhima", "kacyiru"]
    },
    {
      id: "r102",
      name: "Route 102",
      longName: "Downtown → Kimironko",
      firstDeparture: "5:30 AM",
      frequency: "Every 10-15 min",
      stopSequence: ["downtown", "muhima", "remera", "kimironko"]
    }
  ],
  // Sample point-to-point distances in km
  distancesKm: {
    "nyabugogo-kacyiru": 7.4,
    "nyabugogo-remera": 11.2,
    "downtown-kimironko": 9.8,
    "downtown-kacyiru": 4.5,
    "remera-kimironko": 3.1,
    "nyabugogo-kimisagara": 1.8,
    "kimisagara-muhima": 2.2,
    "muhima-kacyiru": 3.4,
    "downtown-muhima": 1.5,
    "muhima-remera": 5.2
  },
  farePerKm: 60 // RWF per km, flat rate as this stage for now
};

document.addEventListener("DOMContentLoaded", () => {
  const originSelect = document.getElementById("originSelect");
  const destSelect = document.getElementById("destSelect");

  if (!originSelect || !destSelect) return;

  populateStopOptions(originSelect, 0);
  populateStopOptions(destSelect, 4);

  originSelect.addEventListener("change", updateDashboard);
  destSelect.addEventListener("change", updateDashboard);

  window.selectQuickRoute = function (fromId, toId) {
    originSelect.value = fromId;
    destSelect.value = toId;
    updateDashboard();
  };

  updateDashboard();

  function populateStopOptions(selectEl, defaultIndex) {
    MOCK_TRANSIT_DATA.stops.forEach((stop, index) => {
      const isDefault = index === defaultIndex;
      selectEl.add(new Option(stop.name, stop.id, isDefault, isDefault));
    });
  }

  function findStop(id) {
    return MOCK_TRANSIT_DATA.stops.find((stop) => stop.id === id);
  }

  function lookupDistanceKm(originId, destId) {
    const forward = MOCK_TRANSIT_DATA.distancesKm[`${originId}-${destId}`];
    const reverse = MOCK_TRANSIT_DATA.distancesKm[`${destId}-${originId}`];
    // Use a flat estimate if this exact pair isn't in the sample data.
    return forward ?? reverse ?? 5.0;
  }

  function findRouteCovering(originId, destId) {
    return MOCK_TRANSIT_DATA.routes.find(
      (route) => route.stopSequence.includes(originId) && route.stopSequence.includes(destId)
    );
  }

  function updateDashboard() {
    const origin = originSelect.value;
    const dest = destSelect.value;

    const els = {
      fare: document.getElementById("fareOutput"),
      distance: document.getElementById("distanceOutput"),
      routeName: document.getElementById("routeNameOutput"),
      scheduleMeta: document.getElementById("scheduleMetaRow"),
      timeline: document.getElementById("timelineContainer"),
      busMarker: document.getElementById("liveBusMarker"),
      mapLabel: document.getElementById("mapPlaceholderText")
    };

    if (origin === dest) {
      showInvalidSelection(els);
      return;
    }

    const distanceKm = lookupDistanceKm(origin, dest);
    const fare = Math.round((distanceKm * MOCK_TRANSIT_DATA.farePerKm) / 10) * 10;
    els.fare.textContent = `${fare} RWF`;
    els.fare.classList.remove("is-invalid");
    els.distance.textContent = distanceKm;

    const route = findRouteCovering(origin, dest);
    if (route) {
      showMatchedRoute(route, origin, els);
    } else {
      showCustomTrip(origin, dest, els);
    }
  }

  function showInvalidSelection(els) {
    els.fare.textContent = "Pick two different stops";
    els.fare.classList.add("is-invalid");
    els.distance.textContent = "0";
    els.routeName.textContent = "Origin and destination must differ";
    els.scheduleMeta.classList.remove("is-visible");
    els.timeline.innerHTML = `<p class="timeline-empty-message">Choose a different starting stop or destination.</p>`;
    els.busMarker.classList.remove("is-visible");
    els.mapLabel.classList.remove("is-hidden");
    els.mapLabel.textContent = "Choose a trip to preview it here";
  }

  function showMatchedRoute(route, originId, els) {
    els.routeName.textContent = `${route.name}: ${route.longName}`;
    document.getElementById("firstRunOutput").textContent = route.firstDeparture;
    document.getElementById("frequencyOutput").textContent = route.frequency;
    els.scheduleMeta.classList.add("is-visible");

    els.timeline.innerHTML = "";
    route.stopSequence.forEach((stopId) => {
      const stop = findStop(stopId);
      const isBoardingStop = stopId === originId;
      const node = document.createElement("div");
      node.className = `timeline-node-item ${isBoardingStop ? "node-active" : ""}`;
      node.innerHTML = `
        <h5>${stop.name}</h5>
        <p>${isBoardingStop ? "Your boarding stop" : stop.desc}</p>
      `;
      els.timeline.appendChild(node);
    });

    els.mapLabel.classList.add("is-hidden");
    els.busMarker.classList.add("is-visible");
    // Sample data has no real GPS feed yet, so the marker's position along
    // the preview track is randomized 
    els.busMarker.style.left = `${Math.floor(Math.random() * 40) + 20}%`;
  }

  function showCustomTrip(originId, destId, els) {
    els.routeName.textContent = "Custom trip (no direct route in sample data)";
    els.scheduleMeta.classList.remove("is-visible");
    els.busMarker.classList.remove("is-visible");
    els.mapLabel.classList.remove("is-hidden");
    els.mapLabel.textContent = "No sample route covers this pair yet";

    const originStop = findStop(originId);
    const destStop = findStop(destId);
    els.timeline.innerHTML = `
      <div class="timeline-node-item node-active">
        <h5>${originStop.name}</h5>
        <p>Boarding stop</p>
      </div>
      <div class="timeline-node-item">
        <h5>${destStop.name}</h5>
        <p>Destination</p>
      </div>
    `;
  }
});