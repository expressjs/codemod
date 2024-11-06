import express from "express";

const app = express();

app.get("/send", function (req, res) {
    res.send(200, { hello: "world" });
});

app.get("/send", function (req, response) {
    response.send(200, "Hello World");
});

app.get("/send", function (req, res) {
    res.send(200, true);
});

app.get("/send", (req, res) => {
    res.send(200);
});

app.get("/send", (req, response) => {
    response.send(200);
});