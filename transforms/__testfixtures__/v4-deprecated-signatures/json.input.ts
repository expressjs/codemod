import express from "express";

const app = express();

app.get("/json", function (req, res) {    
    res.json({ user: "Username", isValid: true }, 200);
});

app.get("/json", function (req, response) {
    response.json({ user: "Username", isValid: true }, 200);
});

app.get("/json", (req, res) => {
    res.json({ user: "Username", isValid: true }, 200);
});

app.get("/json", (req, response) => {
    response.json({ user: "Username", isValid: true }, 200);
});

app.get("/json", function (req, res) {
    res.json({}, 200);
});

app.get("/json", function (req, response) {
    response.json({}, 200);
});

app.get("/json", (req, res) => {
    res.json({}, 200);
});

app.get("/json", (req, response) => {
    response.json({}, 200);
});

// Still valid syntax -- START
app.get("/json", function (req, res) {
    res.json(null)
    res.json({ user: 'tobi' })
})

app.get("/json", function (req, response) {
    response.json(null)
    response.json({ user: 'tobi' })
})

app.get("/json", function (req, res) {
    res.json(null)
    res.json({ user: 'tobi' })
})

app.get("/json", function (req, response) {
    response.json(null)
    response.json({ user: 'tobi' })
})
// Still valid syntax -- END