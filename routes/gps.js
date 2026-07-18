
const express = require("express");
const router = express.Router();
const db = require("../db");


// Get latest GPS location of a bus
router.get("/:bus_id", (req, res) => {

    const busId = req.params.bus_id;


    db.get(
        `
        SELECT *
        FROM gps_locations
        WHERE bus_id = ?
        ORDER BY recorded_at DESC
        LIMIT 1
        `,
        [busId],

        (err, result) => {

            if(err){
                return res.status(500).json({
                    error: err.message
                });
            }


            if(!result){

                return res.status(404).json({
                    message:"No GPS data found"
                });

            }


            res.json(result);

        }
    );

});



// Add GPS location
router.post("/", (req,res)=>{


    const {
        bus_id,
        latitude,
        longitude,
        speed
    } = req.body;



    db.run(
        `
        INSERT INTO gps_locations
        (
            bus_id,
            latitude,
            longitude,
            speed
        )
        VALUES (?,?,?,?)
        `,
        [
            bus_id,
            latitude,
            longitude,
            speed
        ],


        function(err){

            if(err){

                return res.status(500).json({
                    error:err.message
                });

            }


            res.json({

                message:"GPS location saved",
                id:this.lastID

            });


        }

    );


});


module.exports = router;