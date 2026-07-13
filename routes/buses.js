const express = require('express');
const router = express.Router();

const buses = [
    { id: 1, busNumber: 'RAB-001A', route: 'Nyabugogo - Kacyiru', status: 'Active', latitude: -1.9441, longitude: 30.0619 },
    { id: 2, busNumber: 'RAB-002B', route: 'Nyabugogo - Remera', status: 'Active', latitude: -1.9536, longitude: 30.1127 },
    { id: 3, busNumber: 'RAB-003C', route: 'Nyabugogo - Downtown', status: 'Active', latitude: -1.9500, longitude: 30.0588 }
];

router.get('/', (req, res) => {
    res.json(buses);
});

router.get('/:id', (req, res) => {
    const bus = buses.find(b => b.id === parseInt(req.params.id));
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json(bus);
});

module.exports = router;

