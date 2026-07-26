const express = require("express");
const router = express.Router();
const db = require("../db");


// Get latest GPS location for all buses
router.get("/", (req, res) => {

    const sql = `
        SELECT
            bus_location.*,
            bus.bus_number,
            bus.license_plate,
            bus.status

        FROM bus_location

        LEFT JOIN bus
            ON bus.bus_id = bus_location.bus_id

        INNER JOIN (

            SELECT 
                bus_id,
                MAX(recorded_at) AS latest_time

            FROM bus_location

            GROUP BY bus_id

        ) latest

        ON bus_location.bus_id = latest.bus_id
        AND bus_location.recorded_at = latest.latest_time

        ORDER BY bus_location.bus_id ASC
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


// Get latest GPS location for one bus
router.get("/:bus_id", (req, res) => {

    const busId = req.params.bus_id;


    const sql = `
        SELECT *
        FROM bus_location
        WHERE bus_id = ?
        ORDER BY recorded_at DESC
        LIMIT 1
    `;


    db.query(sql, [busId], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }


        if (results.length === 0) {

            return res.status(404).json({
                message: "No GPS data found"
            });

        }


        res.json(results[0]);

    });

});


// Save GPS location
router.post("/", (req, res) => {

    const {
        bus_id,
        trip_id = null,
        latitude,
        longitude,
        speed = 0

    } = req.body;


    if (!bus_id || latitude === undefined || longitude === undefined) {

        return res.status(400).json({
            message: "bus_id, latitude and longitude are required"
        });

    }


    const sql = `
        INSERT INTO bus_location
            (bus_id, trip_id, latitude, longitude, speed)
        VALUES
            (?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            bus_id,
            trip_id,
            latitude,
            longitude,
            speed
        ],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }


            res.status(201).json({

                message: "GPS location saved",
                location_id: result.insertId

            });

        }
    );

});


module.exports = router;