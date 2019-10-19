//import express and create server
const express = require("express");
const app = express();
const db = require("./database");
const cors = require("cors");
const bodyParser = require("body-parser");
const md5 = require("md5");
const Validator = require("./validator");

//server port
const APP_PORT = 8080;

//configure server
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//use router
const api = express.Router();

const validator = new Validator();

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
    const properties = ["name", "email", "password"];
    const validationResult = validator.validate(properties, req.body);

    if (validationResult) {
        res.status(422).json({ "error": validationResult.join(", ") });
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

api.patch("/users/:id", (req, res) => {
    const properties = ["name", "email", "password"];
    const validationResult = validator.validate(properties, req.body);

    if (validationResult) {
        res.status(422).json({ "error": validationResult.join(", ") });
        return;
    }

    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password ? md5(req.body.password) : null
    };

    db.run(`UPDATE user SET
                name = COALESCE(?, name),
                email = COALESCE(?, email),
                password = COALESCE(?, password)
                WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }

            res.json({
                message: "success",
                data: data,
                changes: this.changes
            });
        });
});

api.delete("/users/:id", (req, res) => {
    const sql = "DELETE FROM user WHERE id = ?";
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: "success",
            status: 200,
            changes: this.changes
        });
    });
});

app.use("/api", api);
app.listen(APP_PORT, () => {
    console.log(`server running and listening on ${APP_PORT}`);
});