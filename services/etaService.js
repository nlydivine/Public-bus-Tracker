/**
 * Calculate distance between two GPS coordinates
 * Returns distance in kilometres
 */

function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371; // Earth radius in km

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;


    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);


    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));


    return R * c;

}



/**
 * Calculate ETA in minutes
 * Based on GPS distance and bus speed
 */

function calculateETA(lat1, lon1, lat2, lon2, speed) {


    const distance = calculateDistance(
        lat1,
        lon1,
        lat2,
        lon2
    );


    if (!speed || speed <= 0) {

        return 0;

    }


    const eta = (distance / speed) * 60;


    return Math.max(0, eta);

}



module.exports = {
    calculateDistance,
    calculateETA
};