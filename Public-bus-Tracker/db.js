/**
 * ==========================================================
 * Kigali Public Transport Tracker
 * MySQL Database Configuration
 * ==========================================================
 */

require("dotenv").config();
const mysql = require("mysql2");

// Hosted MySQL-compatible providers (e.g. TiDB Cloud) require TLS.
// Local XAMPP/MySQL doesn't, so this is opt-in via DB_SSL=true in .env.
const useSSL = process.env.DB_SSL === "true";

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "public_transport_tracker",
    port: Number(process.env.DB_PORT || 3306),
    ...(useSSL && {
        ssl: {
            minVersion: "TLSv1.2",
            rejectUnauthorized: true
        }
    })
});


db.connect((err) => {
    if (err) {
        console.error("❌ MySQL connection failed:");
        console.error(err.message);
        return;
    }

    console.log("✅ MySQL Database Connected Successfully");
});


module.exports = db;