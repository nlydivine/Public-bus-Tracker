const Route = require('../models/Route');
const Bus = require('../models/Bus');

async function handleUssd(req, res) {
  const { text } = req.body;
  const input = (text || '').split('*').filter(Boolean);

  let response;

  if (input.length === 0) {
    response = `CON Welcome to Kigali Bus Tracker
1. Check next bus by route
2. Find route between two stops
3. Report an issue`;
  } else if (input[0] === '1' && input.length === 1) {
    const routes = await Route.find({ active: true }).limit(6);
    const list = routes.map((r, i) => `${i + 1}. ${r.routeName}`).join('\n');
    response = `CON Select a route:\n${list}`;
  } else if (input[0] === '1' && input.length === 2) {
    const routes = await Route.find({ active: true }).limit(6);
    const idx = Number(input[1]) - 1;
    const route = routes[idx];
    if (!route) {
      response = 'END Invalid selection.';
    } else {
      const activeBuses = await Bus.find({ route: route._id, status: 'active' }).limit(3);
      if (activeBuses.length === 0) {
        response = `END No buses currently active on ${route.routeName}. Try again shortly.`;
      } else {
        const lines = activeBuses
          .map((b) => `Bus ${b.busNumber}: ${b.isStale(90) ? 'signal lost' : 'tracking live'}`)
          .join('\n');
        response = `END ${route.routeName}\n${lines}`;
      }
    }
  } else if (input[0] === '2') {
    response = 'END Route search by USSD is coming soon. Please use the app for now.';
  } else if (input[0] === '3') {
    response = 'END Thanks — please describe the issue to our support line: 1234.';
  } else {
    response = 'END Invalid option.';
  }

  res.set('Content-Type', 'text/plain');
  res.send(response);
}

module.exports = { handleUssd };
