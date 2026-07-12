const router = require('express').Router();
const { listRoutes, getRoute, listBusesOnRoute } = require('../controllers/routeController');

router.get('/', listRoutes);
router.get('/:id', getRoute);
router.get('/:id/buses', listBusesOnRoute);

module.exports = router;
