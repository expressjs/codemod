import express from "express";

const app = express();

app.get("/json", function (req, res) {
    res.json();
});

app.get("/jsonp", function (req, res) {
    res.status(200).jsonp({ user: "Username", isValid: true });
});

app.get("/jsonp", function (req, response) {
    response.status(200).jsonp({ user: "Username", isValid: true });
});

app.get("/jsonp", (req, res) => {
    res.status(200).jsonp({ user: "Username", isValid: true });
});

app.get("/jsonp", (req, response) => {
    response.status(200).jsonp({ user: "Username", isValid: true });
});

app.get("/jsonp", function (req, res) {
    res.status(200).jsonp({});
});

app.get("/jsonp", function (req, response) {
    response.status(200).jsonp({});
});

app.get("/jsonp", (req, res) => {
    res.status(200).jsonp({})
});

app.get("/jsonp", (req, response) => {
    response.status(200).jsonp({})
});

// Still valid syntax -- START
app.get("/jsonp", function (req, res) {
    res.jsonp(null)
    res.jsonp({ user: 'tobi' })
})

app.get("/jsonp", function (req, response) {
    response.jsonp(null)
    response.jsonp({ user: 'tobi' })
})

app.get("/jsonp", function (req, res) {
    res.jsonp(null)
    res.jsonp({ user: 'tobi' })
})

app.get("/jsonp", function (req, response) {
    response.jsonp(null)
    response.jsonp({ user: 'tobi' })
})
// Still valid syntax -- END