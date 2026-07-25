const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all stops
router.get("/", (req, res) => {
    const sql = `
        SELECT
            stop_id,
            stop_name,
            latitude,
            longitude,
            district,
            is_terminal
        FROM stop
        ORDER BY stop_name
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

// Get a single stop
router.get("/:id", (req, res) => {
    const sql = `
        SELECT
            stop_id,
            stop_name,
            latitude,
            longitude,
            district,
            is_terminal
        FROM stop
        WHERE stop_id = ?
    `;

    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Stop not found"
            });
        }

        res.json(results[0]);
    });
});

module.exports = router;
