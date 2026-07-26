
const db = require("../db");

/**
 * Get all bus stops
 */
function getAllStops() {

    return new Promise((resolve, reject) => {

        db.query(
            "SELECT * FROM stop ORDER BY stop_name",
            (err, results) => {

                if (err) {
                    return reject(err);
                }

                resolve(results);

            }
        );

    });

}

/**
 * Get one stop
 */
function getStopById(stopId) {

    return new Promise((resolve, reject) => {

        db.query(
            "SELECT * FROM stop WHERE stop_id = ?",
            [stopId],
            (err, results) => {

                if (err) {
                    return reject(err);
                }

                if (results.length === 0) {
                    return resolve(null);
                }

                resolve(results[0]);

            }
        );

    });

}

module.exports = {
    getAllStops,
    getStopById
};