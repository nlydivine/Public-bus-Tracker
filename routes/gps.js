const express = require("express");
const router = express.Router();
const db = require("../db");

// Get latest GPS location for every bus
router.get("/", (req, res) => {

    const sql = `
        SELECT
            b.bus_id,
            b.bus_number,
            bl.latitude,
            bl.longitude,
            bl.speed,
            bl.recorded_at
        FROM bus b
        LEFT JOIN bus_location bl
            ON b.bus_id = bl.bus_id
        WHERE bl.recorded_at = (
            SELECT MAX(recorded_at)
            FROM bus_location
            WHERE bus_id = b.bus_id
        )
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json(results);

    });

});

// Latest GPS for one bus
router.get("/:busId", (req, res) => {

    const sql = `
        SELECT *
        FROM bus_location
        WHERE bus_id=?
        ORDER BY recorded_at DESC
        LIMIT 1
    `;

    db.query(sql, [req.params.busId], (err, results) => {

        if (err)
            return res.status(500).json(err);

        res.json(results[0] || {});

    });

});

module.exports = router;