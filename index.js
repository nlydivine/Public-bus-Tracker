/**
 * ==========================================================
 * Kigali Public Transport Tracker
 * ==========================================================
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// Routes
const busRoutes = require("./routes/buses");
const routeRoutes = require("./routes/routes");
const fareRoutes = require("./routes/fares");
const gpsRoutes = require("./routes/gps");
const stopRoutes = require("./routes/stops");
const ussdRoutes = require("./routes/ussd");


const app = express();


// ======================================================
// Middleware
// ======================================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ 
    extended: true 
}));


// ======================================================
// Serve Frontend
// ======================================================

app.use(express.static(path.join(__dirname, "frontend")));


// ======================================================
// API Routes
// ======================================================

app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/fares", fareRoutes);
app.use("/api/gps", gpsRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/ussd", ussdRoutes);



// ======================================================
// API Health Check
// ======================================================

app.get("/api", (req, res) => {

    res.json({
        success: true,
        message: "Kigali Public Transport Tracker API is running"
    });

});


// ======================================================
// Frontend Home Page
// ======================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "frontend", "index.html")
    );

});


// ======================================================
// 404 Handler
// ======================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Endpoint not found",

        path: req.originalUrl

    });

});


// ======================================================
// Start Server
// ======================================================

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log("==================================");

    console.log(
        `Server running at http://localhost:${PORT}`
    );

    console.log("==================================");

});