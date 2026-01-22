import express from "express";

const app = express();

app.get("/json", function (req, res) {
    res.json();
});

app.get("/jsonp", function (req, res) {
    res.jsonp({ user: "Username", isValid: true }, 200);
});

app.get("/jsonp", function (req, response) {
    response.jsonp({ user: "Username", isValid: true }, 200);
});

app.get("/jsonp", (req, res) => {
    res.jsonp({ user: "Username", isValid: true }, 200);
});

app.get("/jsonp", (req, response) => {
    response.jsonp({ user: "Username", isValid: true }, 200);
});

app.get("/jsonp", function (req, res) {
    res.jsonp({}, 200);
});

app.get("/jsonp", function (req, response) {
    response.jsonp({}, 200);
});

app.get("/jsonp", (req, res) => {
    res.jsonp({}, 200)
});

app.get("/jsonp", (req, response) => {
    response.jsonp({}, 200)
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