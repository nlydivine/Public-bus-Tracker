require('dotenv').config();
const connectDB = require('../config/db');
const Stop = require('../models/Stop');
const Route = require('../models/Route');
const Bus = require('../models/Bus');

async function main() {
  await connectDB();

  const stops = await Stop.find().limit(5);
  if (stops.length < 2) {
    console.error('[seed-demo] Need at least 2 stops in the DB first. Run: npm run seed:stops');
    process.exit(1);
  }

  const route = await Route.findOneAndUpdate(
    { routeName: 'DEMO Route' },
    {
      routeName: 'DEMO Route',
      operator: 'Demo Operator',
      origin: stops[0].name,
      destination: stops[stops.length - 1].name,
      stops: stops.map((s, i) => ({ stop: s._id, sequence: i, avgSecondsFromPrevStop: i === 0 ? 0 : 300 })),
      fareRwf: 400,
      active: true,
    },
    { upsert: true, new: true }
  );

  await Bus.findOneAndUpdate(
    { busNumber: 'DEMO-001' },
    {
      busNumber: 'DEMO-001',
      route: route._id,
      operator: 'Demo Operator',
      status: 'active',
      currentLocation: stops[0].location,
      lastPingAt: new Date(),
    },
    { upsert: true }
  );

  console.log(`[seed-demo] Created route "${route.routeName}" with bus DEMO-001.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
