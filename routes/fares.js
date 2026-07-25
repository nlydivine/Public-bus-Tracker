const express = require("express");
const router = express.Router();
const db = require("../db");

// List fares
router.get("/", (req, res) => {

    const sql = `
        SELECT
            route_name,
            fare
        FROM route
    `;

    db.query(sql, (err, results) => {

        if (err)
            return res.status(500).json(err);

        res.json(results);

    });

});

module.exports = router;