
const db = require("../db");

/**
 * Get fare information for a route
 * @param {number} routeId
 * @returns {Promise<Object|null>}
 */
function getFareByRoute(routeId) {
    return new Promise((resolve, reject) => {

        const sql = `
            SELECT
                fare.amount,
                fare.payment_method,
                route.route_name
            FROM fare
            JOIN route
                ON fare.route_id = route.route_id
            WHERE fare.route_id = ?
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

/**
 * Get all fares
 * @returns {Promise<Array>}
 */
function getAllFares() {
    return new Promise((resolve, reject) => {

        const sql = `
            SELECT
                fare.amount,
                fare.payment_method,
                route.route_name
            FROM fare
            JOIN route
                ON fare.route_id = route.route_id
            ORDER BY route.route_name
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
    getFareByRoute,
    getAllFares
};