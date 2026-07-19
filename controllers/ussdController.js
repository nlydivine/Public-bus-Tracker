
const db = require("../db");

const {
    calculateDistance,
    calculateETA
} = require("./eta");

exports.handleUSSD = (req, res) => {

    const text = req.body.text || "";

    let response = "";

    if (text === "") {

        response = `CON Welcome to Kigali Public Transport Tracker

1. Check Bus Arrival
2. Find Route
3. Bus Fare
4. Nearby Bus Stops
5. Report Delay`;

        res.set("Content-Type", "text/plain");
        return res.send(response);

    }

    else if (text === "1") {

    response = `CON Select Bus Stop

1. Nyabugogo
2. Kimironko
3. Kacyiru
4. Remera
5. Kabuga
6. Downtown`;

    res.set("Content-Type", "text/plain");
    return res.send(response);

}

    else if (text.startsWith("1*")) {

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
        res.set("Content-Type", "text/plain");
        return res.send("END Invalid Bus Stop");
    }

        const sql = `
            SELECT
                stop.stop_name,
                route.route_name,
                route_stop.estimated_time
            FROM stop
            JOIN route_stop
                ON stop.stop_id = route_stop.stop_id
            JOIN route
                ON route.route_id = route_stop.route_id
            WHERE stop.stop_id = ?
        `;

        db.query(sql, [stopId], (err, results) => {

            if (err) {
                res.set("Content-Type", "text/plain");
                return res.send("END Database Error");
            }

            if (results.length === 0) {
                res.set("Content-Type", "text/plain");
                return res.send("END Bus Stop Not Found");
            }

            const stop = results[0];

            const gpsSQL = `
SELECT *
FROM bus_location
WHERE bus_id = 1
ORDER BY recorded_at DESC
LIMIT 1
`;

            db.query(gpsSQL, (gpsErr, gpsResults)=>{


    if(gpsErr || gpsResults.length === 0){

        response = `END
Stop: ${stop.stop_name}

 res.set("Content-Type", "text/plain");
        res.send(response);

Route:
${stop.route_name}

ETA:
GPS data unavailable`;

        res.set("Content-Type","text/plain");
        return res.send(response);

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



    response = `END
Stop: ${stop.stop_name}

Route:
${stop.route_name}

Distance:
${distance.toFixed(2)} km

ETA:
${eta} minutes`;


    res.set("Content-Type","text/plain");
    res.send(response);


});

            res.set("Content-Type", "text/plain");
            res.send(response);

        });

        return;

    }

    else {

        response = "END Invalid Option";

       
    }

};