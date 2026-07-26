const express = require("express");

const router = express.Router();

const db = require("../db");


// =====================================================
// GET ALL LATEST BUS GPS LOCATIONS
// =====================================================

router.get("/", async (req, res) => {

    try {

        const rows = await db.all(`

            SELECT

                gps_locations.id,

                gps_locations.bus_id,

                buses.bus_number,

                buses.plate_number,

                buses.status,

                gps_locations.latitude,

                gps_locations.longitude,

                gps_locations.speed,

                gps_locations.heading,

                gps_locations.recorded_at

            FROM gps_locations

            LEFT JOIN buses

                ON buses.id =
                   gps_locations.bus_id

            ORDER BY

                gps_locations.recorded_at DESC

        `);


        res.json({

            success: true,

            data: rows

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});


// =====================================================
// GET LATEST GPS LOCATION FOR ONE BUS
// =====================================================

router.get("/:bus_id", async (req, res) => {

    try {

        const busId =
            Number(req.params.bus_id);


        const rows = await db.all(`

            SELECT *

            FROM gps_locations

            WHERE bus_id = ${busId}

            ORDER BY recorded_at DESC

            LIMIT 1

        `);


        if (rows.length === 0) {

            return res.status(404).json({

                success: false,

                message:

                    "No GPS data found"

            });

        }


        res.json({

            success: true,

            data: rows[0]

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});


// =====================================================
// SAVE NEW GPS LOCATION
// =====================================================

router.post("/", async (req, res) => {

    try {

        const {

            bus_id,

            latitude,

            longitude,

            speed = 0,

            heading = 0

        } = req.body;


        if (

            !bus_id ||

            latitude === undefined ||

            longitude === undefined

        ) {

            return res.status(400).json({

                success: false,

                message:

                    "bus_id, latitude and longitude are required"

            });

        }


        const busId =
            Number(bus_id);


        const lat =
            Number(latitude);


        const lng =
            Number(longitude);


        const busSpeed =
            Number(speed);


        const busHeading =
            Number(heading);


        const sql = `

            INSERT INTO gps_locations

            (

                bus_id,

                latitude,

                longitude,

                speed,

                heading

            )

            VALUES

            (

                ${busId},

                ${lat},

                ${lng},

                ${busSpeed},

                ${busHeading}

            )

        `;


        await db.run(sql);


        // =================================================
        // UPDATE CURRENT BUS POSITION
        // =================================================

        await db.run(`

            UPDATE buses

            SET

                latitude = ${lat},

                longitude = ${lng},

                speed = ${busSpeed},

                last_updated =
                    CURRENT_TIMESTAMP

            WHERE id = ${busId}

        `);


        // =================================================
        // SEND LIVE SOCKET.IO UPDATE
        // =================================================

        const io =
            req.app.get("io");


        if (io) {

            io.emit(

                "busLocationUpdated",

                {

                    bus_id: busId,

                    latitude: lat,

                    longitude: lng,

                    speed: busSpeed,

                    heading: busHeading

                }

            );

        }


        res.status(201).json({

            success: true,

            message:

                "GPS location saved successfully",

            data: {

                bus_id: busId,

                latitude: lat,

                longitude: lng,

                speed: busSpeed,

                heading: busHeading

            }

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});


module.exports = router;
