//import express and create server
const express = require("express");
const app = express();
const db = require("./database");
const cors = require("cors");
const bodyParser = require("body-parser");

//server port
const APP_PORT = 8080;

//start server
app.use(cors());
app.use(bodyParser.json());

//use router
const api = express.Router();

//get all users
api.get("/users", (req, res, next) => {
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

api.get("/users/:id", (req, res) => {
    const sql = "SELECT * FROM user WHERE id = ?";
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: "success",
            status: 200,
            data: row
        });
    });
});

app.use("/api", api);
app.listen(APP_PORT, () => {
    console.log(`server running and listening on ${APP_PORT}`);
});