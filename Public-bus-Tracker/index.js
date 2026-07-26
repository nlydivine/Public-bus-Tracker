const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

const busRoutes = require("./routes/buses");
const routeRoutes = require("./routes/routes");
const fareRoutes = require("./routes/fares");
const gpsRoutes = require("./routes/gps");
const ussdRoutes = require("./routes/ussd");
const stopRoutes = require("./routes/stops");
const etaRoutes = require("./routes/eta");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "frontend")));

app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/fares", fareRoutes);
app.use("/api/gps", gpsRoutes);
app.use("/api/ussd", ussdRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/eta", etaRoutes);

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "Kigali Public Transport Tracker API is running"
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
        path: req.originalUrl
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    // No real GPS trackers yet, so fake realistic bus movement instead.
    // Set SIMULATE_BUSES=false in .env to turn this off.
    const { start: startBusSimulation } = require("./simulateBuses");
    startBusSimulation({ port: PORT });
});
