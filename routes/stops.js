const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all bus stops
router.get("/", (req, res) => {

    const sql = `
        SELECT *
        FROM stop
        ORDER BY stop_name
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json(results);

    });

});

// Add a bus stop
router.post("/", (req, res) => {

    const { stop_name, latitude, longitude } = req.body;

    const sql = `
        INSERT INTO stop (stop_name, latitude, longitude)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [stop_name, latitude, longitude],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            res.json({
                message: "Bus stop added successfully",
                id: result.insertId
            });

        }
    );

});

module.exports = router;