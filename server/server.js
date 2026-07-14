
/**
 * ==========================================================
 * Kigali Public Transport Tracker
 * ==========================================================
 */

require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { Server } = require("socket.io");

// Database
const db = require("./db");

// Existing Routes
const busRoutes = require("./routes/buses");
const routeRoutes = require("./routes/routes");
const fareRoutes = require("./routes/fares");

// ======================================================
// Create Express Application
// ======================================================

const app = express();
const server = http.createServer(app);

// ======================================================
// Socket.IO Configuration
// ======================================================

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Make Socket.IO available throughout the application
app.set("io", io);

// ======================================================
// Global Middleware
// ======================================================

// Security Headers
app.use(helmet());

// Allow Cross-Origin Requests
app.use(cors());

// Parse JSON
app.use(express.json());

// Parse URL Encoded Data
app.use(express.urlencoded({ extended: true }));

// Log HTTP Requests
app.use(morgan("dev"));

// ======================================================
// Welcome Route
// ======================================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        application: "Kigali Public Transport Tracker",
        version: "1.0.0",
        backend: "Node.js + Express",
        database: "SQLite",
        status: "Running",
        message: "Welcome to the Kigali Public Transport Tracker API."
    });
});

// ======================================================
// Health Check
// ======================================================

app.get("/health", (req, res) => {

    db.get("SELECT datetime('now') AS server_time", (err, row) => {

        if (err) {
            return res.status(500).json({
                success: false,
                database: "Disconnected",
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            server: "Running",
            database: "Connected",
            time: row.server_time
        });

    });

});

// ======================================================
// Register API Routes
// ======================================================

app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/fares", fareRoutes);

// ======================================================
// Future Routes
// ======================================================

// app.use("/api/gps", require("./routes/gps"));
// app.use("/api/stops", require("./routes/stops"));
// app.use("/api/users", require("./routes/users"));
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/admin", require("./routes/admin"));

// ======================================================
// Socket.IO Events
// ======================================================

io.on("connection", (socket) => {

    console.log(`Client Connected: ${socket.id}`);

    socket.emit("welcome", {
        message: "Connected to Kigali Public Transport Tracker"
    });

    socket.on("disconnect", () => {
        console.log(`Client Disconnected: ${socket.id}`);
    });

});

// ======================================================
// 404 Handler
// ======================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Endpoint Not Found"
    });

});

// ======================================================
// Global Error Handler
// ======================================================

app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({

        success: false,

        message: "Internal Server Error",

        error:
            process.env.NODE_ENV === "development"
                ? err.message
                : "Unexpected server error."

    });

});

// ======================================================
// Graceful Shutdown
// ======================================================

process.on("SIGINT", () => {

    console.log("\nClosing SQLite Connection...");

    db.close((err) => {

        if (err) {

            console.error(err.message);

        } else {

            console.log("SQLite Connection Closed.");

        }

        process.exit(0);

    });

});

// ======================================================
// Export Server
// ======================================================

module.exports = server;