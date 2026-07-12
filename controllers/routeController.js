const Route = require('../models/Route');
const Bus = require('../models/Bus');

async function listRoutes(req, res) {
  const routes = await Route.find({ active: true }).populate('stops.stop');
  res.json(routes);
}

async function getRoute(req, res) {
  const route = await Route.findById(req.params.id).populate('stops.stop');
  if (!route) return res.status(404).json({ error: 'Route not found' });
  res.json(route);
}

async function listBusesOnRoute(req, res) {
  const buses = await Bus.find({ route: req.params.id });
  res.json(buses);
}

module.exports = { listRoutes, getRoute, listBusesOnRoute };
