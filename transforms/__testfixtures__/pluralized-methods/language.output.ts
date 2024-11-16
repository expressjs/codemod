import express from 'express'

const app = express()

app.get('/', (req, res) => {
    const encoding = req.acceptsLanguages('gzip');
    res.json({ encoding });
});

app.get('/', function (request, response) {
    const encoding = request.acceptsLanguages('gzip');
    response.json({ encoding });
});