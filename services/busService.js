
const db = require("../db");

function getLatestBusOnRoute(routeId) {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT
                bus_location.latitude,
                bus_location.longitude,
                bus_location.speed,
                bus.bus_number,
                route.route_name
            FROM bus_location
            JOIN bus
                ON bus_location.bus_id = bus.bus_id
            JOIN route
                ON bus.route_id = route.route_id
            WHERE route.route_id = ?
            ORDER BY bus_location.recorded_at DESC
            LIMIT 1
        `;

        db.query(sql, [routeId], (err, results) => {

            if (err) {
                return reject(err);
            }

            if (results.length === 0) {
                return resolve(null);
            }

            resolve(results[0]);

        });

    });

}

module.exports = {
    getLatestBusOnRoute
};