import express from "express";

const app = express();

app.get("/send", function (req, res) {
    res.status(200).send({ hello: "world" });
});

app.get("/send", function (req, response) {
    response.status(200).send("Hello World");
});

app.get("/send", function (req, res) {
    res.sendStatus(200);
});

app.get("/send", function (req, res) {
    res.status(200).send(true);
});

app.get("/send", (req, res) => {
    res.status(200).send({ hello: "world" });
});

app.get("/send", (req, res) => {
    res.sendStatus(200);
});

app.get("/send", (req, response) => {
    response.sendStatus(200);
});

app.get("/send", (req, response) => {
    response.status(200).send(true);
});

// Still valid syntax -- START
app.get("/send", function (req, res) {
    res.send(Buffer.from('whoop'));
    res.send({ some: 'json' });
    res.send('<p>some html</p>');
});

app.get("/send", function (req, response) {
    response.send(Buffer.from('whoop'));
    response.send({ some: 'json' });
    response.send('<p>some html</p>');
});

app.get("/send", (req, response) => {
    response.send(Buffer.from('whoop'));
    response.send({ some: 'json' });
    response.send('<p>some html</p>');
});

app.get("/send", (req, res) => {
    res.send(Buffer.from('whoop'));
    res.send({ some: 'json' });
    res.send('<p>some html</p>');
});
// Still valid syntax -- END