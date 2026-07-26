/**
 * ==========================================================
 * KIGALI PUBLIC TRANSPORT TRACKER API
 * ==========================================================
 */

require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { Server } = require("socket.io");

const db = require("./db");

const busRoutes = require("./routes/buses");
const routeRoutes = require("./routes/routes");
const fareRoutes = require("./routes/fares");
const gpsRoutes = require("./routes/gps");


// ==========================================================
// EXPRESS APPLICATION
// ==========================================================

const app = express();

const server = http.createServer(app);


// ==========================================================
// SOCKET.IO
// ==========================================================

const io = new Server(server, {

    cors: {

        origin: "*",

        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE"
        ]

    }

});


// Make Socket.IO available to routes

app.set("io", io);


// ==========================================================
// MIDDLEWARE
// ==========================================================

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(morgan("dev"));


// ==========================================================
// HOME ROUTE
// ==========================================================

app.get("/", (req, res) => {

    res.status(200).json({

        success: true,

        application:
            "Kigali Public Transport Tracker",

        version:
            "1.0.0",

        backend:
            "Node.js + Express",

        database:
            "SQLite",

        maps:
            "Google Maps Ready",

        gps:
            "Live GPS Tracking Ready",

        realtime:
            "Socket.IO Enabled",

        status:
            "Running",

        message:
            "Welcome to the Kigali Public Transport Tracker API."

    });

});


// ==========================================================
// HEALTH CHECK
// ==========================================================

app.get("/health", async (req, res) => {

    try {

        const result = await db.get(
            "SELECT datetime('now') AS server_time"
        );

        res.status(200).json({

            success: true,

            server:
                "Running",

            database:
                "Connected",

            time:
                result.server_time

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            server:
                "Running",

            database:
                "Disconnected",

            error:
                error.message

        });

    }

});


// ==========================================================
// API ROUTES
// ==========================================================

app.use(
    "/api/buses",
    busRoutes
);

app.use(
    "/api/routes",
    routeRoutes
);

app.use(
    "/api/fares",
    fareRoutes
);

app.use(
    "/api/gps",
    gpsRoutes
);


// ==========================================================
// SOCKET.IO CONNECTION
// ==========================================================

io.on("connection", (socket) => {

    console.log(
        "Frontend connected: " + socket.id
    );


    socket.emit(

        "welcome",

        {

            success: true,

            message:
                "Connected to Kigali Public Transport Tracker",

            realtime:
                "Live bus location updates enabled"

        }

    );


    socket.on("disconnect", () => {

        console.log(

            "Frontend disconnected: " +
            socket.id

        );

    });

});


// ==========================================================
// 404 HANDLER
// ==========================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message:
            "Endpoint Not Found",

        path:
            req.originalUrl

    });

});


// ==========================================================
// ERROR HANDLER
// ==========================================================

app.use(

    (err, req, res, next) => {

        console.error(
            err.stack
        );

        res.status(500).json({

            success: false,

            message:
                "Internal Server Error",

            error:
                err.message

        });

    }

);


// ==========================================================
// START SERVER
// ==========================================================

const PORT =
    process.env.PORT || 3000;


server.listen(

    PORT,

    () => {

        console.log(
            "=================================================="
        );

        console.log(
            "Kigali Public Transport Tracker"
        );

        console.log(
            "=================================================="
        );

        console.log(
            "Server running on port " + PORT
        );

        console.log(
            "API: http://localhost:" + PORT
        );

        console.log(
            "GPS: http://localhost:" +
            PORT +
            "/api/gps"
        );

        console.log(
            "Buses: http://localhost:" +
            PORT +
            "/api/buses"
        );

        console.log(
            "Routes: http://localhost:" +
            PORT +
            "/api/routes"
        );

        console.log(
            "Fares: http://localhost:" +
            PORT +
            "/api/fares"
        );

        console.log(
            "Google Maps integration: Ready"
        );

        console.log(
            "Real-time GPS updates: Enabled"
        );

        console.log(
            "=================================================="
        );

    }

);
