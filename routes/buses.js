const express = require('express');
const router = express.Router();
const db = require('../db');
console.log("BUS ROUTE FILE LOADED");


// Get all buses with route information
router.get('/', (req, res) => {

    const sql = `
        SELECT 
            bus.bus_id,
            bus.bus_number,
            bus.license_plate,
            bus.capacity,
            bus.status,
            bus.operator,

            route.route_id,
            route.route_name,
            route.start_point,
            route.end_point,
            route.distance

        FROM bus

        LEFT JOIN route
        ON bus.route_id = route.route_id
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


// Get single bus
router.get('/:id', (req, res) => {

    const sql = "SELECT * FROM bus WHERE bus_id = ?";

    db.query(
        sql,
        [req.params.id],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }


            if (results.length === 0) {
                return res.status(404).json({
                    message: "Bus not found"
                });
            }


            res.json(results[0]);

        }
    );

});


// Add new bus
router.post('/', (req, res) => {

    const {
        bus_number,
        license_plate,
        capacity,
        status,
        operator
    } = req.body;


    const sql = `
        INSERT INTO bus
        (
            bus_number,
            license_plate,
            capacity,
            status,
            operator
        )
        VALUES (?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            bus_number,
            license_plate,
            capacity,
            status,
            operator
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }


            res.json({
                message: " Bus added successfully",
                bus_id: result.insertId
            });

        }
    );

});

module.exports = router;