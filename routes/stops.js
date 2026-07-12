const router = require('express').Router();
const { listStops, createStop } = require('../controllers/stopController');
const { userAuth, requireRole } = require('../middleware/userAuth');

router.get('/', listStops);
router.post('/', userAuth, requireRole('admin'), createStop);

module.exports = router;
