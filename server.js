//import express and create server
const express = require("express");
const app = express();
const db = require("./database");
const cors = require("cors");
const bodyParser = require("body-parser");
const md5 = require("md5");

//server port
const APP_PORT = 8080;

//configure server
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
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

api.post("/users/", (req, res) => {
    const errors = [];
    const properties = ["name", "email", "password"];
    properties.forEach(prop => {
        if (!req.body[prop]) {
            errors.push(`${prop} is required`);
        }
    });

    if (errors.length) {
        res.status(400).json({ "error": errors.join(", ") });
        return;
    }

    const data = {
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password)
    };

    const sql = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
    const params = [data.name, data.email, data.password];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: "success",
            status: 200,
            data: data,
            id: this.lastID
        });
    });
});

app.use("/api", api);
app.listen(APP_PORT, () => {
    console.log(`server running and listening on ${APP_PORT}`);
});