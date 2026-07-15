const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM route', (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(results);
    });
});

router.get('/:id', (req, res) => {
    db.query('SELECT * FROM route WHERE route_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Route not found' });
        res.json(results[0]);
    });
});

router.get('/:id/stops', (req, res) => {
    db.query(
        'SELECT s.* FROM stop s JOIN route_stop rs ON s.stop_id = rs.stop_id WHERE rs.route_id = ? ORDER BY rs.stop_order',
        [req.params.id],
        (err, results) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json(results);
        }
    );
});

module.exports = router;
