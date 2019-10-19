//import express and create server
const express = require("express");
const app = express();
const db = require("./database");

//server port
const APP_PORT = 8080;

//start server
app.listen(APP_PORT, () => {
    console.log(`server running and listening on ${APP_PORT}`);
});

//root endpoint
app.get("/api/users", (req, res, next) => {
    const sql = "SELECT * FROM user";
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: "success",
            status: 200,
            data: rows
        });
    });
});

// Insert here other API endpoints

// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});
