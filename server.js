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

app.use("/api", api);
app.listen(APP_PORT, () => {
    console.log(`server running and listening on ${APP_PORT}`);
});