const express = require('express');
const router = express.Router();
const db = require('../db');

// Official RURA tariff (effective April 6, 2026)
const KIGALI_TARIFF_PER_KM = 59.28;
const MINIMUM_FARE = 300;

router.get('/', (req, res) => {
    try {
        db.query('SELECT route_id, route_name, distance FROM route', (err, results) => {
            if (err) return res.status(500).json({ message: err.message });

            const fares = results.map(route => ({
                route_id: route.route_id,
                route_name: route.route_name,
                distance: route.distance,
                fare: Math.max(MINIMUM_FARE, Math.round(route.distance * KIGALI_TARIFF_PER_KM)),
                tariff_type: 'RURA_Kigali_Official'
            }));

            res.json(fares);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', (req, res) => {
    try {
        db.query(
            'SELECT route_id, route_name, distance FROM route WHERE route_id = ?',
            [req.params.id],
            (err, results) => {
                if (err) return res.status(500).json({ message: err.message });
                if (results.length === 0) {
                    return res.status(404).json({ message: 'Fare not found' });
                }

                const route = results[0];
                res.json({
                    route_id: route.route_id,
                    route_name: route.route_name,
                    distance: route.distance,
                    fare: Math.max(MINIMUM_FARE, Math.round(route.distance * KIGALI_TARIFF_PER_KM)),
                    tariff_type: 'RURA_Kigali_Official',
                    note: 'Tariff effective April 6, 2026'
                });
            }
        );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Optional: New endpoint for custom distance calculations
router.post('/calculate', (req, res) => {
    try {
        const { distance } = req.body;

        if (!distance || isNaN(distance)) {
            return res.status(400).json({ message: 'Valid distance is required' });
        }

        const fare = Math.max(MINIMUM_FARE, Math.round(distance * KIGALI_TARIFF_PER_KM));

        res.json({
            distance: distance,
            fare: fare,
            tariff_per_km: KIGALI_TARIFF_PER_KM,
            minimum_fare: MINIMUM_FARE,
            tariff_type: 'RURA_Kigali_Official'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;