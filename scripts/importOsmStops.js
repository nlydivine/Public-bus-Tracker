require('dotenv').config();
const fetch = require('node-fetch');
const connectDB = require('../config/db');
const Stop = require('../models/Stop');

const KIGALI_BBOX = '-2.0800,29.9800,-1.8800,30.2200';

const OVERPASS_QUERY = `
[out:json][timeout:60];
(
  node["highway"="bus_stop"](${KIGALI_BBOX});
  node["public_transport"="platform"]["bus"="yes"](${KIGALI_BBOX});
  node["amenity"="bus_station"](${KIGALI_BBOX});
);
out body;
`;

async function main() {
  await connectDB();

  console.log('[import] Querying Overpass API for Kigali bus stops...');
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: OVERPASS_QUERY,
    headers: { 'Content-Type': 'text/plain' },
  });

  if (!res.ok) {
    throw new Error(`Overpass API returned ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const elements = data.elements || [];
  console.log(`[import] Received ${elements.length} candidate stop nodes from OSM.`);

  let created = 0;
  let skipped = 0;

  for (const el of elements) {
    if (el.type !== 'node' || typeof el.lat !== 'number' || typeof el.lon !== 'number') {
      skipped++;
      continue;
    }

    const name = el.tags?.name || el.tags?.['name:en'] || `Unnamed stop (OSM ${el.id})`;

    const exists = await Stop.findOne({ osmId: String(el.id) });
    if (exists) {
      skipped++;
      continue;
    }

    await Stop.create({
      name,
      source: 'osm',
      osmId: String(el.id),
      location: { type: 'Point', coordinates: [el.lon, el.lat] },
      verified: false,
    });
    created++;
  }

  console.log(`[import] Done. Created ${created} new stops, skipped ${skipped} (duplicates/invalid).`);
  process.exit(0);
}

main().catch((err) => {
  console.error('[import] Failed:', err.message);
  process.exit(1);
});
