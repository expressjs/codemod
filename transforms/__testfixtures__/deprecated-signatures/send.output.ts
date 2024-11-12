import express from "express";

const app = express();

app.get("/send", function (req, res) {
    res.status(200).send({ hello: "world" });
});

app.get("/send", function (req, response) {
    response.status(200).send("Hello World");
});

app.get("/send", function (req, res) {
    res.status(200).send(true);
});

app.get("/send", (req, res) => {
    res.sendStatus(200);
});

app.get("/send", (req, response) => {
    response.sendStatus(200);
});