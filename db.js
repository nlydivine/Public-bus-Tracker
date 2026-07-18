/**
 * ==========================================================
 * Kigali Public Transport Tracker
 * MySQL Database Configuration
 * ==========================================================
 */

const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "public_transport_tracker",
    port: 3306
});


db.connect((err) => {
    if (err) {
        console.error("❌ MySQL connection failed:");
        console.error(err);
        return;
    }

    console.log("✅ MySQL Database Connected Successfully");
});


module.exports = db;