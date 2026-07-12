const router = require('express').Router();
const { planTrip } = require('../controllers/tripPlannerController');

router.get('/', planTrip);

module.exports = router;
