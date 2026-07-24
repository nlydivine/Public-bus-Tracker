const db = require("../db");

const {
    calculateDistance,
    calculateETA
} = require("./eta");

function sendText(res, response) {
    res.set("Content-Type", "text/plain");
    return res.send(response);
}

exports.handleUSSD = (req, res) => {
    const text = req.body.text || "";

    if (text === "") {
        return sendText(res, `CON Welcome to Kigali Public Transport Tracker

1. Check Bus Arrival
2. Find Route
3. Bus Fare
4. Nearby Bus Stops
5. Report Delay`);
    }

    if (text === "1") {
        return sendText(res, `CON Select Bus Stop

1. Nyabugogo
2. Kimironko
3. Kacyiru
4. Remera
5. Kabuga
6. Downtown`);
    }

    if (text.startsWith("1*")) {
        const option = text.split("*")[1];

        const stopMap = {
            "1": 1,
            "2": 2,
            "3": 3,
            "4": 4,
            "5": 5,
            "6": 6
        };

        const stopId = stopMap[option];

        if (!stopId) {
            return sendText(res, "END Invalid Bus Stop");
        }

        const sql = `
            SELECT
                stop.stop_id,
                stop.stop_name,
                stop.latitude,
                stop.longitude,
                route.route_name,
                route_stop.estimated_time
            FROM stop
            JOIN route_stop
                ON stop.stop_id = route_stop.stop_id
            JOIN route
                ON route.route_id = route_stop.route_id
            WHERE stop.stop_id = ?
            LIMIT 1
        `;

        db.query(sql, [stopId], (err, results) => {
            if (err) {
                return sendText(res, "END Database Error");
            }

            if (results.length === 0) {
                return sendText(res, "END Bus Stop Not Found");
            }

            const stop = results[0];

            const gpsSQL = `
                SELECT *
                FROM bus_location
                WHERE bus_id = 1
                ORDER BY recorded_at DESC
                LIMIT 1
            `;

            db.query(gpsSQL, (gpsErr, gpsResults) => {
                if (gpsErr || gpsResults.length === 0) {
                    return sendText(res, `END Stop: ${stop.stop_name}

Route:
${stop.route_name}

ETA:
GPS data unavailable`);
                }

                const busLocation = gpsResults[0];

                const distance = calculateDistance(
                    Number(busLocation.latitude),
                    Number(busLocation.longitude),
                    Number(stop.latitude),
                    Number(stop.longitude)
                );

                const eta = calculateETA(
                    distance,
                    Number(busLocation.speed)
                );

                return sendText(res, `END Stop: ${stop.stop_name}

Route:
${stop.route_name}

Distance:
${distance.toFixed(2)} km

ETA:
${eta} minutes`);
            });
        });

        return;
    }

    return sendText(res, "END Invalid Option");
};