import express from "express";

const app = express();

app.get("/json", function (req, res) {    
    res.json({ user: "Username", isValid: true }, 200);
});

app.get("/json", function (req, res) {
    res.json({}, 200);
});

app.get("/json", function (req, response) {
    response.json({}, 200);
});

app.get("/json", (req, res) =>{
    res.json({}, 200);
});

app.get("/json", (req, response) => {
    response.json({}, 200);
});

app.get("/jsonp", function (req, res) {
    res.jsonp({}, 200);
});

app.get("/jsonp", function (req, response) {
    response.jsonp({}, 200);
});

app.get("/jsonp", (req, res) =>{
    res.jsonp({}, 200)
});

app.get("/jsonp", (req, response) =>{
    response.jsonp({}, 200)
});

app.get("/json", function (req, res) {    
    res.jsonp({ user: "Username", isValid: true }, 200);
});