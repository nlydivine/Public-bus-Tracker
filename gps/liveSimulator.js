/**
 * ==========================================================
 * Kigali Public Transport Tracker
 * Route Based GPS Simulator
 * ==========================================================
 */

const db = require("../db");

const UPDATE_INTERVAL = 5000; // milliseconds
const MOVE_DISTANCE = 0.0005; // small GPS movement


let buses = [];

let busStates = {};


// ----------------------------------------------------------
// Load all buses
// ----------------------------------------------------------

function loadBuses(callback) {


    const sql = `
        SELECT 
            bus_id,
            bus_number,
            route_id
        FROM bus
        WHERE route_id IS NOT NULL
    `;


    db.query(sql, (err, results)=>{


        if(err){

            console.error(
                "Loading buses failed:",
                err
            );

            return;

        }


        buses = results;


        console.log(
            `Loaded ${buses.length} buses`
        );


        let completed = 0;


        buses.forEach(bus=>{


            loadBusRoute(bus, ()=>{


                completed++;


                if(completed === buses.length){

                    callback();

                }


            });


        });


    });


}



// ----------------------------------------------------------
// Load route stops
// ----------------------------------------------------------

function loadBusRoute(bus, callback){


    const sql = `

        SELECT

            s.stop_id,
            s.stop_name,
            s.latitude,
            s.longitude,
            rs.stop_order


        FROM route_stop rs


        JOIN stop s

        ON rs.stop_id = s.stop_id


        WHERE rs.route_id = ?


        ORDER BY rs.stop_order ASC

    `;



    db.query(
        sql,
        [bus.route_id],

        (err, results)=>{


            if(err){

                console.error(err);

                callback();

                return;

            }



            if(results.length < 2){

                console.log(
                    `Bus ${bus.bus_id} has no valid route`
                );

                callback();

                return;

            }



            busStates[bus.bus_id] = {


                stops: results,


                currentStop:0,


                nextStop:1,


                latitude:
                    Number(results[0].latitude),


                longitude:
                    Number(results[0].longitude)


            };



            console.log(
                `Bus ${bus.bus_id} route loaded`
            );


            callback();


        }
    );


}




// ----------------------------------------------------------
// Move bus
// ----------------------------------------------------------

function moveBus(bus){


    const state =
        busStates[bus.bus_id];


    if(!state){

        return;

    }



    const target =
        state.stops[state.nextStop];



    const latDifference =
        Number(target.latitude) -
        state.latitude;



    const lngDifference =
        Number(target.longitude) -
        state.longitude;



    const distance =
        Math.sqrt(
            latDifference ** 2 +
            lngDifference ** 2
        );



    // reached stop

    if(distance < MOVE_DISTANCE){


        state.latitude =
            Number(target.latitude);


        state.longitude =
            Number(target.longitude);



        state.currentStop =
            state.nextStop;



        state.nextStop++;



        if(
            state.nextStop >= state.stops.length
        ){

            state.nextStop = 0;

        }


    }

    else{


        state.latitude +=
            (latDifference / distance)
            * MOVE_DISTANCE;



        state.longitude +=
            (lngDifference / distance)
            * MOVE_DISTANCE;


    }



    saveLocation(
        bus,
        state
    );


}




// ----------------------------------------------------------
// Save GPS
// ----------------------------------------------------------

function saveLocation(bus,state){


    const sql = `

        INSERT INTO bus_location

        (
            bus_id,
            latitude,
            longitude,
            speed,
            recorded_at
        )

        VALUES
        (?,?,?,?,NOW())

    `;



    db.query(

        sql,

        [

            bus.bus_id,

            state.latitude,

            state.longitude,

            35


        ],

        err=>{


            if(err){

                console.error(
                    err
                );

                return;

            }


            console.log(

                `Bus ${bus.bus_id} updated`,
                state.latitude.toFixed(6),
                state.longitude.toFixed(6)

            );


        }

    );


}




// ----------------------------------------------------------
// Start
// ----------------------------------------------------------

console.log(
    "GPS Route Simulator Starting..."
);



loadBuses(()=>{


    console.log(
        "All buses ready. Simulation running..."
    );



    setInterval(()=>{


        buses.forEach(bus=>{


            moveBus(bus);


        });


    }, UPDATE_INTERVAL);



});