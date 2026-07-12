const map = L.map('map').setView([-1.9536, 30.0605], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19,
}).addTo(map);

document.getElementById('tab-map').addEventListener('click', () => switchView('map'));
document.getElementById('tab-plan').addEventListener('click', () => switchView('plan'));
function switchView(name) {
  document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.getElementById(`tab-${name}`).classList.add('active');
  document.getElementById(`view-${name}`).classList.add('active');
  if (name === 'map') setTimeout(() => map.invalidateSize(), 100);
}

async function loadStops() {
  const res = await fetch('/api/stops');
  const stops = await res.json();

  stops.forEach((stop) => {
    const [lng, lat] = stop.location.coordinates;
    L.circleMarker([lat, lng], { radius: 5, color: '#0b6e4f' })
      .addTo(map)
      .bindPopup(stop.name);
  });

  return stops;
}

const busMarkers = new Map();

function upsertBusMarker(bus) {
  const icon = L.divIcon({ className: 'bus-marker', html: 'B', iconSize: [28, 28] });
  if (busMarkers.has(bus.busId || bus._id)) {
    const marker = busMarkers.get(bus.busId || bus._id);
    marker.setLatLng([bus.lat, bus.lng]);
  } else {
    const marker = L.marker([bus.lat, bus.lng], { icon }).addTo(map).bindPopup(bus.busNumber);
    busMarkers.set(bus.busId || bus._id, marker);
  }
}

async function loadActiveBuses() {
  const res = await fetch('/api/tracking/buses');
  const buses = await res.json();
  buses
    .filter((b) => !b.stale)
    .forEach((b) => {
      const [lng, lat] = b.currentLocation.coordinates;
      upsertBusMarker({ busId: b._id, busNumber: b.busNumber, lat, lng });
    });
}

const socket = io();
async function subscribeToAllRoutes() {
  const res = await fetch('/api/routes');
  const routes = await res.json();
  routes.forEach((r) => socket.emit('subscribe:route', r._id));
}
socket.on('bus:update', (bus) => upsertBusMarker(bus));

async function populateStopSelects(stops) {
  const originSel = document.getElementById('origin-stop');
  const destSel = document.getElementById('destination-stop');
  stops.forEach((s) => {
    originSel.add(new Option(s.name, s._id));
    destSel.add(new Option(s.name, s._id));
  });
}

document.getElementById('trip-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const originStopId = document.getElementById('origin-stop').value;
  const destinationStopId = document.getElementById('destination-stop').value;
  const departAtMinutesFromNow = document.getElementById('depart-minutes').value;

  const params = new URLSearchParams({ originStopId, destinationStopId, departAtMinutesFromNow });
  const res = await fetch(`/api/trip-plan?${params}`);
  const data = await res.json();

  const list = document.getElementById('trip-results');
  list.innerHTML = '';
  if (!data.options || data.options.length === 0) {
    list.innerHTML = `<li>${data.message || 'No buses found for this window.'}</li>`;
    return;
  }
  data.options.forEach((opt) => {
    const li = document.createElement('li');
    li.textContent = `${opt.routeName} — Bus ${opt.busNumber} — ~${opt.etaMinutesToOrigin} min away — ${opt.fareRwf ?? '?'} RWF`;
    list.appendChild(li);
  });
});

(async function init() {
  const stops = await loadStops();
  await populateStopSelects(stops);
  await loadActiveBuses();
  await subscribeToAllRoutes();
})();
