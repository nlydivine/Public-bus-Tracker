const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {

    const sql = `
        SELECT *
        FROM route
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);

    });

});

module.exports = router;