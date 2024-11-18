import express from "express";

const app = express();

app.get("/json", function (req, res) {    
    res.status(200).json({ user: "Username", isValid: true });
});

app.get("/json", function (req, response) {
    response.status(200).json({ user: "Username", isValid: true });
});

app.get("/json", (req, res) => {
    res.status(200).json({ user: "Username", isValid: true });
});

app.get("/json", (req, response) => {
    response.status(200).json({ user: "Username", isValid: true });
});

app.get("/json", function (req, res) {
    res.status(200).json({});
});

app.get("/json", function (req, response) {
    response.status(200).json({});
});

app.get("/json", (req, res) => {
    res.status(200).json({});
});

app.get("/json", (req, response) => {
    response.status(200).json({});
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