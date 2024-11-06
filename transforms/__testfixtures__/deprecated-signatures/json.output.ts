import express from "express";

const app = express();

app.get("/json", function (req, res) {    
    res.status(200).json({ user: "Username", isValid: true });
});

app.get("/json", function (req, res) {
    res.status(200).json({});
});

app.get("/json", function (req, response) {
    response.status(200).json({});
});

app.get("/json", (req, res) =>{
    res.status(200).json({});
});

app.get("/json", (req, response) => {
    response.status(200).json({});
});

app.get("/jsonp", function (req, res) {
    res.status(200).jsonp({});
});

app.get("/json", function (req, response) {
    response.status(200).jsonp({});
});

app.get("/jsonp", (req, res) =>{
    res.status(200).jsonp({})
});

app.get("/jsonp", (req, response) =>{
    response.status(200).jsonp({})
});

app.get("/json", function (req, res) {    
    res.status(200).jsonp({ user: "Username", isValid: true });
});