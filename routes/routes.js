const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    db.query('SELECT * FROM bus', (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(results);
    });
});

router.get('/:id', (req, res) => {
    db.query('SELECT * FROM bus WHERE bus_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Bus not found' });
        res.json(results[0]);
    });
});

module.exports = router;

