const express = require('express');
const router = express.Router();

const routes = [
    { id: 1, routeName: 'Nyabugogo - Kacyiru', stops: ['Nyabugogo', 'Kimironko', 'Kacyiru'], distance: 8.5, duration: 30 },
    { id: 2, routeName: 'Nyabugogo - Remera', stops: ['Nyabugogo', 'Kanombe', 'Remera'], distance: 10.2, duration: 35 },
    { id: 3, routeName: 'Nyabugogo - Downtown', stops: ['Nyabugogo', 'Sonatube', 'Rwandex', 'Downtown'], distance: 5.0, duration: 20 },
    { id: 4, routeName: 'Kabuga - Downtown', stops: ['Kabuga', 'Kanombe', 'Remera', 'Sonatube', 'Rwandex', 'Downtown'], distance: 15.3, duration: 50 }
];

router.get('/', (req, res) => {
    res.json(routes);
});

router.get('/:id', (req, res) => {
    const route = routes.find(r => r.id === parseInt(req.params.id));
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
});

module.exports = router;

