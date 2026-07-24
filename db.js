/**
 * ==========================================================
 * Kigali Public Transport Tracker
 * MySQL Database Configuration
 * ==========================================================
 */

require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "public_transport_tracker",
    port: Number(process.env.DB_PORT || 3306)
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