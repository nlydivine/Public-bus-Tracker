const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all routes
router.get("/", (req, res) => {

    const sql = `
        SELECT *
        FROM route
        ORDER BY route_id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json(results);

    });

});

// Get one route
router.get("/:id", (req, res) => {

    const sql = `
        SELECT *
        FROM route
        WHERE route_id = ?
    `;

    db.query(sql, [req.params.id], (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json(results[0] || {});

    });

});

// Get buses on a route
router.get("/:id/buses", (req, res) => {

    const sql = `
        SELECT *
        FROM bus
        WHERE route_id = ?
    `;

    db.query(sql, [req.params.id], (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json(results);

    });

});

module.exports = router;