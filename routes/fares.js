const express = require('express');
const router = express.Router();

const fares = [
    { id: 1, routeName: 'Nyabugogo - Kacyiru', distance: 8.5, fare: 400 },
    { id: 2, routeName: 'Nyabugogo - Remera', distance: 10.2, fare: 500 },
    { id: 3, routeName: 'Nyabugogo - Downtown', distance: 5.0, fare: 300 },
    { id: 4, routeName: 'Kabuga - Downtown', distance: 15.3, fare: 700 }
];

router.get('/', (req, res) => {
    res.json(fares);
});

router.get('/:id', (req, res) => {
    const fare = fares.find(f => f.id === parseInt(req.params.id));
    if (!fare) return res.status(404).json({ message: 'Fare not found' });
    res.json(fare);
});

module.exports = router;

