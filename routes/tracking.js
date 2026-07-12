const router = require('express').Router();
const trackerAuth = require('../middleware/trackerAuth');
const { ingestPing, listLiveBuses } = require('../controllers/trackingController');

router.post('/ping', trackerAuth, ingestPing);
router.get('/buses', listLiveBuses);

module.exports = router;
