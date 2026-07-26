/**
 * ==========================================================
 * Kigali Public Transport Tracker
 * MySQL Database Configuration
 * ==========================================================
 */

require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "public_transport_tracker",
    port: Number(process.env.DB_PORT || 30000),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Quick sanity check on startup so you see a clear log if credentials
// are wrong, without holding open a connection the whole app relies on.
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ MySQL connection failed:");
        console.error(err.message);
        return;
    }

    console.log("✅ MySQL Database Connected Successfully");
    connection.release();
});

module.exports = db;