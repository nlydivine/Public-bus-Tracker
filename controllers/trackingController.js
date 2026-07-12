const fetch = require('node-fetch');
const Bus = require('../models/Bus');

const lastSnapAt = new Map();
const SNAP_MIN_INTERVAL_MS = 15000;
const MOVE_THRESHOLD_METERS = 15;

function haversineMeters([lng1, lat1], [lng2, lat2]) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function snapToRoad(lat, lng) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return { lat, lng, snapped: false };

  try {
    const url = `https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    const point = data?.snappedPoints?.[0]?.location;
    if (point) return { lat: point.latitude, lng: point.longitude, snapped: true };
    return { lat, lng, snapped: false };
  } catch (err) {
    console.error('[roads-api] snap failed, using raw point:', err.message);
    return { lat, lng, snapped: false };
  }
}

async function ingestPing(req, res) {
  const { busNumber, lat, lng, heading, speedKmh } = req.body;

  if (!busNumber || typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'busNumber, lat, lng are required' });
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return res.status(400).json({ error: 'lat/lng out of range' });
  }

  const bus = await Bus.findOne({ busNumber });
  if (!bus) return res.status(404).json({ error: `Unknown bus: ${busNumber}` });

  const prevCoords = bus.currentLocation?.coordinates || [0, 0];
  const movedMeters = haversineMeters(prevCoords, [lng, lat]);

  const now = Date.now();
  const last = lastSnapAt.get(String(bus._id)) || 0;
  const shouldSnap = movedMeters > MOVE_THRESHOLD_METERS && now - last > SNAP_MIN_INTERVAL_MS;

  let finalLat = lat;
  let finalLng = lng;
  if (shouldSnap) {
    const snapped = await snapToRoad(lat, lng);
    finalLat = snapped.lat;
    finalLng = snapped.lng;
    lastSnapAt.set(String(bus._id), now);
  }

  bus.currentLocation = { type: 'Point', coordinates: [finalLng, finalLat] };
  bus.heading = typeof heading === 'number' ? heading : bus.heading;
  bus.speedKmh = typeof speedKmh === 'number' ? speedKmh : bus.speedKmh;
  bus.lastPingAt = new Date();
  bus.status = 'active';
  await bus.save();

  const io = req.app.get('io');
  io.to(`route:${bus.route}`).emit('bus:update', {
    busId: bus._id,
    busNumber: bus.busNumber,
    lat: finalLat,
    lng: finalLng,
    heading: bus.heading,
    speedKmh: bus.speedKmh,
    updatedAt: bus.lastPingAt,
  });

  res.json({ ok: true, snapped: shouldSnap });
}

async function listLiveBuses(req, res) {
  const filter = { status: 'active' };
  if (req.query.routeId) filter.route = req.query.routeId;

  const buses = await Bus.find(filter).select(
    'busNumber route currentLocation heading speedKmh lastPingAt status'
  );

  const withFreshness = buses.map((b) => ({
    ...b.toObject(),
    stale: b.isStale(60),
  }));

  res.json(withFreshness);
}

module.exports = { ingestPing, listLiveBuses };
