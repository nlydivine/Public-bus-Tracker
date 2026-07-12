const Stop = require('../models/Stop');

async function listStops(req, res) {
  const { near, radiusMeters = 1000, verifiedOnly } = req.query;
  const filter = {};
  if (verifiedOnly === 'true') filter.verified = true;

  if (near) {
    const [lng, lat] = near.split(',').map(Number);
    filter.location = {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: Number(radiusMeters),
      },
    };
  }

  const stops = await Stop.find(filter).limit(500);
  res.json(stops);
}

async function createStop(req, res) {
  const { name, lat, lng, sector, source } = req.body;
  if (!name || typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'name, lat, lng are required' });
  }
  const stop = await Stop.create({
    name,
    sector,
    source: source || 'manual',
    location: { type: 'Point', coordinates: [lng, lat] },
  });
  res.status(201).json(stop);
}

module.exports = { listStops, createStop };
