const express = require("express");
const router = express.Router();
const db = require("../db");
const { calculateDistance, calculateETA } = require("../controllers/eta");

// =====================================================
// GET /api/eta/:bus_id/:stop_id
// Straight-line distance + rough ETA (in minutes) from a
// bus's last reported GPS position to a given stop.
// This is an estimate ("as the crow flies"), not a
// road-following distance.
// =====================================================
router.get("/:bus_id/:stop_id", (req, res) => {
    const { bus_id, stop_id } = req.params;

    db.query(
        `SELECT latitude, longitude, speed, recorded_at
         FROM bus_location
         WHERE bus_id = ?
         ORDER BY recorded_at DESC
         LIMIT 1`,
        [bus_id],
        (err, locationRows) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            if (locationRows.length === 0) {
                return res.status(404).json({ message: "No GPS data for this bus yet" });
            }

            db.query(
                `SELECT stop_id, stop_name, latitude, longitude FROM stop WHERE stop_id = ?`,
                [stop_id],
                (err2, stopRows) => {
                    if (err2) {
                        return res.status(500).json({ message: err2.message });
                    }

                    if (stopRows.length === 0) {
                        return res.status(404).json({ message: "Stop not found" });
                    }

                    const busLocation = locationRows[0];
                    const stop = stopRows[0];

                    const distanceKm = calculateDistance(
                        Number(busLocation.latitude),
                        Number(busLocation.longitude),
                        Number(stop.latitude),
                        Number(stop.longitude)
                    );

                    const etaMinutes = calculateETA(distanceKm, Number(busLocation.speed));

                    res.json({
                        bus_id: Number(bus_id),
                        stop_id: Number(stop_id),
                        stop_name: stop.stop_name,
                        distance_km: Math.round(distanceKm * 100) / 100,
                        eta_minutes: etaMinutes,
                        based_on_speed_kmh: busLocation.speed || 30,
                        last_updated: busLocation.recorded_at
                    });
                }
            );
        }
    );
});

module.exports = router;
