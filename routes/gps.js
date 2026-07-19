const express = require("express");
const router = express.Router();
const db = require("../db");

console.log("gps.js loaded");

// Get latest GPS location

router.get("/", (req, res) => {

    const sql = `
        SELECT *
        FROM bus_location
        ORDER BY recorded_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(result);

    });

});

router.get("/:bus_id", (req,res)=>{

    const busId = req.params.bus_id;


    const sql = `
        SELECT *
        FROM bus_location
        WHERE bus_id = ?
        ORDER BY recorded_at DESC
        LIMIT 1
    `;


    db.query(sql,[busId],(err,result)=>{


        if(err){
            return res.status(500).json({
                error:err.message
            });
        }


        if(result.length === 0){

            return res.status(404).json({
                message:"No GPS data found"
            });

        }


        res.json(result[0]);

    });

});



// Save GPS location

router.post("/",(req,res)=>{


const {
    bus_id,
    latitude,
    longitude,
    speed
}=req.body;



const sql = `
INSERT INTO bus_location
(bus_id, latitude, longitude, speed)
VALUES (?,?,?,?)
`;



db.query(
sql,
[
bus_id,
latitude,
longitude,
speed
],

(err,result)=>{


if(err){

return res.status(500).json({
error:err.message
});

}


res.json({

message:"GPS location saved",
id:result.insertId

});


});


});


module.exports = router;