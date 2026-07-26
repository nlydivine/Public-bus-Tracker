const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT route_id, route_name, distance FROM route', (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        const fares = results.map(route => ({
            route_id: route.route_id,
            route_name: route.route_name,
            distance: route.distance,
            fare: Math.round(route.distance * 50)
        }));
        res.json(fares);
    });
});

router.get('/:id', (req, res) => {
    db.query('SELECT route_id, route_name, distance FROM route WHERE route_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Fare not found' });
        const route = results[0];
        res.json({
            route_id: route.route_id,
            route_name: route.route_name,
            distance: route.distance,
            fare: Math.round(route.distance * 50)
        });
    });
});

module.exports = router;

