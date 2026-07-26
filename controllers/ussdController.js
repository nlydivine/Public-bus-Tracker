/**
 * ==========================================================
 * Kigali Public Transport Tracker - USSD Controller
 * ==========================================================
 */

const db = require("../db");

const {
    calculateDistance,
    calculateETA
} = require("../services/etaService");


const sessions = {};

const FARE_PER_KM = 50;



function sendText(res, text) {

    res.set("Content-Type", "text/plain");

    return res.send(text);

}



function getLanguage(sessionId) {

    return sessions[sessionId]?.language || "en";

}



function getPrefix(language) {

    return language === "rw" ? "Murakoze" : "Thank you";

}



exports.handleUSSD = async (req, res) => {


    const sessionId = req.body.sessionId;

    const text = req.body.text || "";



    /*
        FIRST SCREEN
    */

    if(text === "") {

        return sendText(res,

`CON Welcome to Kigali Public Transport Tracker

Hitamo ururimi / Choose language:

1. English
2. Kinyarwanda`);

    }




    /*
        LANGUAGE SELECTION
    */


    if(text === "1") {

        sessions[sessionId] = {
            language:"en"
        };


        return sendText(res,

`CON Kigali Public Transport Tracker

1. Check Bus Arrival
2. Find Route
3. Check Fare
4. Nearby Bus Stops
5. Report Delay
6. Exit`);

    }



    if(text === "2") {

        sessions[sessionId] = {
            language:"rw"
        };


        return sendText(res,

`CON Kigali Public Transport Tracker

1. Kureba igihe imodoka igerera aho uhagaze
2. Gushaka inzira y'urugendo
3. Kureba amafaranga y'urugendo
4. Kureba ahahagarara imodoka hafi yawe
5. Kumenyesha gutinda kw'imodoka
6. Gusohoka`);

    }



    const language = getLanguage(sessionId);




    /*
        EXIT
        FIX: was text.endsWith("*6"), which incorrectly matched any
        nested menu path ending in 6 (e.g. "1*1*6" = Bus Arrival ->
        Downtown), causing valid selections to exit early instead
        of showing results. Exit is only ever reachable directly
        from the main menu, so we match exact paths now.
    */


    if(text === "1*6" || text === "2*6") {


        return sendText(
            res,

            language === "rw"

            ?

`END Murakoze gukoresha Kigali Public Transport Tracker.`

            :

`END Thank you for using Kigali Public Transport Tracker.`

        );

    }





    /*
        ==========================
        BUS ARRIVAL
        ==========================
    */


    if(text === "1*1" || text === "2*1") {


        return sendText(res,

`CON ${language==="rw" ? "Hitamo aho uhagaze" : "Select Bus Stop"}

1. Nyabugogo
2. Kimironko
3. Kacyiru
4. Remera
5. Kabuga
6. Downtown`);

    }




    if(
        text.startsWith("1*1*") ||
        text.startsWith("2*1*")
    ) {


        const stopChoice = text.split("*")[2];


        const stops = {

            1:1,
            2:2,
            3:3,
            4:4,
            5:5,
            6:6

        };


        const stopId = stops[stopChoice];



        const stopSQL = `

        SELECT

        stop.stop_name,
        stop.latitude,
        stop.longitude,

        route.route_id,
        route.route_name


        FROM stop


        JOIN route_stop

        ON stop.stop_id = route_stop.stop_id


        JOIN route

        ON route.route_id = route_stop.route_id


        WHERE stop.stop_id = ?


        LIMIT 1

        `;



        db.query(stopSQL,[stopId],(err,stopResult)=>{


            if(err || stopResult.length===0){

                return sendText(
                    res,
                    "END Stop not found"
                );

            }



            const stop = stopResult[0];



            const gpsSQL = `

            SELECT

            bus.bus_number,

            bus_location.latitude,

            bus_location.longitude,

            bus_location.speed,

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



            db.query(
                gpsSQL,
                [stop.route_id],
                (gpsError,gpsResult)=>{


                if(gpsError || gpsResult.length===0){


                    return sendText(res,

`END ${stop.stop_name}

No bus location available`);

                }



                const bus = gpsResult[0];



                const distance = calculateDistance(

                    Number(bus.latitude),
                    Number(bus.longitude),

                    Number(stop.latitude),
                    Number(stop.longitude)

                );



                const eta = calculateETA(

                    Number(bus.latitude),
                    Number(bus.longitude),

                    Number(stop.latitude),
                    Number(stop.longitude),

                    Number(bus.speed)

                );



                return sendText(res,

`END ${language==="rw" ? "Aho uhagaze" : "Stop"}:
${stop.stop_name}

Bus:
${bus.bus_number}

Route:
${bus.route_name}

Distance:
${distance.toFixed(2)} km

${language==="rw" ? "Igera mu minota" : "Arrival"}:
${Math.ceil(eta)} minutes`);

            });


        });


        return;

    }






    /*
        ==========================
        ROUTE SEARCH
        ==========================
    */


    if(text==="1*2" || text==="2*2") {


        return sendText(res,

`CON ${language==="rw" ? "Hitamo aho ujya" : "Select Destination"}

1. Kacyiru
2. Remera
3. Downtown`);

    }



    if(
        text==="1*2*1" ||
        text==="2*2*1"
    ){

        return sendText(res,

`END Route:

Nyabugogo - Kacyiru

Distance:
8.50 km`);

    }



    if(
        text==="1*2*2" ||
        text==="2*2*2"
    ){

        return sendText(res,

`END Route:

Nyabugogo - Remera

Distance:
10.20 km`);

    }



    if(
        text==="1*2*3" ||
        text==="2*2*3"
    ){

        return sendText(res,

`END Route:

Kabuga - Downtown

Distance:
15.30 km`);

    }






    /*
        ==========================
        FARE
        ==========================
    */


    if(text==="1*3" || text==="2*3") {


        return sendText(res,

`CON ${language==="rw" ? "Hitamo inzira" : "Select Route"}

1. Nyabugogo - Kacyiru
2. Nyabugogo - Remera
3. Kabuga - Downtown`);

    }




    const fareRoutes = {

        "1": {
            name:"Nyabugogo - Kacyiru",
            distance:8.5
        },

        "2":{
            name:"Nyabugogo - Remera",
            distance:10.2
        },

        "3":{
            name:"Kabuga - Downtown",
            distance:15.3
        }

    };



    if(
        text.startsWith("1*3*") ||
        text.startsWith("2*3*")
    ){


        const choice = text.split("*")[2];


        const route = fareRoutes[choice];


        if(!route){

            return sendText(
                res,
                "END Route not found"
            );

        }


        const fare =
        route.distance * FARE_PER_KM;



        return sendText(res,

`END Route:
${route.name}

Distance:
${route.distance} km

Fare:
${fare} RWF`);

    }





    /*
        ==========================
        NEARBY STOPS
        ==========================
    */


    if(text==="1*4" || text==="2*4") {


        return sendText(res,

`END ${language==="rw" ? "Ahahagarara imodoka" : "Nearby Bus Stops"}:

1. Nyabugogo
2. Kimironko
3. Kacyiru
4. Remera
5. Kabuga
6. Downtown`);

    }





    /*
        ==========================
        REPORT DELAY
        ==========================
    */


    if(text==="1*5" || text==="2*5") {


        return sendText(res,

`CON ${language==="rw" ? "Hitamo imodoka" : "Select Bus"}

1. RAB-001A
2. RAB-002B
3. RAB-003C`);

    }



    if(
        text.startsWith("1*5*") ||
        text.startsWith("2*5*")
    ){


        return sendText(res,

language==="rw"

?
`END Murakoze. Ikibazo cy'imodoka cyakiriwe.`

:
`END Thank you. Delay report received.`

        );

    }





    return sendText(
        res,
        "END Invalid Option"
    );


};