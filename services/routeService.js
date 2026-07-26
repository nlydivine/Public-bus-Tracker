
const db = require("../db");

/**
 * Get route by stop ID
 */
function getRouteByStop(stopId) {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT
                stop.stop_id,
                stop.stop_name,
                stop.latitude,
                stop.longitude,
                route.route_id,
                route.route_name,
                route.start_point,
                route.end_point,
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
                return reject(err);
            }

            if (results.length === 0) {
                return resolve(null);
            }

            resolve(results[0]);
        });

    });

}

/**
 * Get all routes
 */
function getAllRoutes() {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT *
            FROM route
            ORDER BY route_name
        `;

        db.query(sql, (err, results) => {

            if (err) {
                return reject(err);
            }

            resolve(results);

        });

    });

}

module.exports = {
    getRouteByStop,
    getAllRoutes
};