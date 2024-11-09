import express from 'express'

const app = express()

app.get('/', (req, res) => {
    const charset = req.acceptsCharsets('utf-8');
    res.json({ charset });
});

app.get('/', function (request, response) {
    const charset = request.acceptsCharsets('utf-8');
    response.json({ charset });
});