
/**
 * ==========================================================
 * Kigali Public Transport Tracker
 * ==========================================================
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database Location
const databasePath = path.join(__dirname, "transport.db");

// Create/Open Database
const db = new sqlite3.Database(databasePath, (err) => {
    if (err) {
        console.error("❌ Failed to connect to SQLite Database");
        console.error(err.message);
    } else {
        console.log(" SQLite Database Connected Successfully");
    }
});

/**
 * Enable Foreign Keys
 */
db.serialize(() => {

    db.run("PRAGMA foreign_keys = ON");

    console.log("Initializing Database...");

    /* =======================================================
       TABLE: ROUTES
    ======================================================= */

    db.run(`
        CREATE TABLE IF NOT EXISTS routes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            route_name TEXT NOT NULL UNIQUE,
            origin TEXT NOT NULL,
            destination TEXT NOT NULL,
            distance REAL NOT NULL,
            estimated_duration INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    /* =======================================================
       TABLE: BUSES
    ======================================================= */

    db.run(`
        CREATE TABLE IF NOT EXISTS buses(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bus_number TEXT NOT NULL UNIQUE,
            plate_number TEXT UNIQUE,
            driver_name TEXT,
            capacity INTEGER DEFAULT 60,
            status TEXT DEFAULT 'Active',
            latitude REAL,
            longitude REAL,
            speed REAL DEFAULT 0,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
            route_id INTEGER,
            FOREIGN KEY(route_id)
                REFERENCES routes(id)
                ON DELETE SET NULL
                ON UPDATE CASCADE
        )
    `);

    /* =======================================================
       TABLE: BUS STOPS
    ======================================================= */

    db.run(`
        CREATE TABLE IF NOT EXISTS bus_stops(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            stop_name TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            route_id INTEGER,
            FOREIGN KEY(route_id)
                REFERENCES routes(id)
                ON DELETE CASCADE
        )
    `);

    /* =======================================================
       TABLE: FARES
    ======================================================= */

    db.run(`
        CREATE TABLE IF NOT EXISTS fares(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            route_id INTEGER NOT NULL,
            fare REAL NOT NULL,
            currency TEXT DEFAULT 'RWF',
            payment_method TEXT DEFAULT 'Tap & Go',
            FOREIGN KEY(route_id)
                REFERENCES routes(id)
                ON DELETE CASCADE
        )
    `);

    /* =======================================================
       TABLE: GPS LOCATIONS
       
    ======================================================= */

    db.run(`
        CREATE TABLE IF NOT EXISTS gps_locations(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bus_id INTEGER NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            speed REAL DEFAULT 0,
            heading REAL,
            recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(bus_id)
                REFERENCES buses(id)
                ON DELETE CASCADE
        )
    `);

    /* =======================================================
       TABLE: USERS
    ======================================================= */

    db.run(`
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'Passenger',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    /* =======================================================
       TABLE: JOURNEYS
      
    ======================================================= */

    db.run(`
        CREATE TABLE IF NOT EXISTS journeys(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bus_id INTEGER,
            route_id INTEGER,
            departure_time DATETIME,
            arrival_time DATETIME,
            estimated_arrival DATETIME,
            status TEXT DEFAULT 'In Progress',

            FOREIGN KEY(bus_id)
                REFERENCES buses(id),

            FOREIGN KEY(route_id)
                REFERENCES routes(id)
        )
    `);

    console.log(" Database Tables Ready");
});

/**
 * Export Database
 */

module.exports = db;