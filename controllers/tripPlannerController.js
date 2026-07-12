const Route = require('../models/Route');
const Bus = require('../models/Bus');

async function planTrip(req, res) {
  const { originStopId, destinationStopId } = req.query;
  const windowMinutes = Number(req.query.departAtMinutesFromNow) || 0;
  const toleranceMinutes = 30;

  if (!originStopId || !destinationStopId) {
    return res.status(400).json({ error: 'originStopId and destinationStopId are required' });
  }

  const routes = await Route.find({
    active: true,
    'stops.stop': { $all: [originStopId, destinationStopId] },
  }).populate('stops.stop');

  const validRoutes = routes.filter((r) => {
    const seqOf = (id) => r.stops.find((s) => String(s.stop._id) === String(id))?.sequence;
    const originSeq = seqOf(originStopId);
    const destSeq = seqOf(destinationStopId);
    return originSeq != null && destSeq != null && originSeq < destSeq;
  });

  if (validRoutes.length === 0) {
    return res.json({ options: [], message: 'No direct route found between these stops yet.' });
  }

  const results = [];

  for (const route of validRoutes) {
    const stopsInOrder = [...route.stops].sort((a, b) => a.sequence - b.sequence);
    const originStop = stopsInOrder.find((s) => String(s.stop._id) === String(originStopId)).stop;

    const buses = await Bus.find({ route: route._id, status: 'active' });

    for (const bus of buses) {
      if (bus.isStale(90)) continue;

      const [lng, lat] = bus.currentLocation.coordinates;
      const [oLng, oLat] = originStop.location.coordinates;
      const straightLineMeters = haversine(lat, lng, oLat, oLng);
      const assumedSpeedMps = ((bus.speedKmh || 18) * 1000) / 3600;
      const etaSeconds = straightLineMeters / Math.max(assumedSpeedMps, 1);
      const etaMinutes = Math.round(etaSeconds / 60);

      if (etaMinutes <= windowMinutes + toleranceMinutes) {
        results.push({
          routeId: route._id,
          routeName: route.routeName,
          operator: route.operator,
          busNumber: bus.busNumber,
          etaMinutesToOrigin: etaMinutes,
          fareRwf: route.fareRwf,
        });
      }
    }
  }

  results.sort((a, b) => a.etaMinutesToOrigin - b.etaMinutesToOrigin);
  res.json({ options: results });
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

module.exports = { planTrip };
