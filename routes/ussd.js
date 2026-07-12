const router = require('express').Router();
const { handleUssd } = require('../controllers/ussdController');

router.post('/', handleUssd);

module.exports = router;
