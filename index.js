require("dotenv").config({ quiet: true });

const express = require("express");
const path = require("path");

const app = express();

const busRoutes = require("./routes/buses");
const routeRoutes = require("./routes/routes");
const fareRoutes = require("./routes/fares");
const gpsRoutes = require("./routes/gps");
const ussdRoutes = require("./routes/ussd");
const stopRoutes = require('./routes/stops');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ===============================
// SERVE FRONTEND
// ===============================

app.use(express.static(
    path.join(__dirname, "frontend")
));


// ===============================
// API ROUTES
// ===============================

app.use("/api/buses", busRoutes);

app.use("/api/routes", routeRoutes);

app.use("/api/fares", fareRoutes);

app.use("/api/gps", gpsRoutes);

app.use("/api/ussd", ussdRoutes);

app.use('/api/stops', stopRoutes);


// ===============================
// FRONTEND PAGES
// ===============================


app.get("/", (req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "frontend",
            "index.html"
        )
    );

});


app.use(express.static(path.join(__dirname,"frontend")));


app.get("/test-file",(req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "frontend",
            "app.html"
        )
    );

});



// API CHECK

app.get("/api",(req,res)=>{

    res.json({
        message:"Kigali Public Transport Tracker API is running"
    });

});



const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

    console.log(
        `Server is running on port ${PORT}`
    );

});