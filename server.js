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
app.get("/", (req, res, next) => {
    res.json({ message: "OK" });
});

// Insert here other API endpoints

// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});
