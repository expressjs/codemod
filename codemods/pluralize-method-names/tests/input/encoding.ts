import express from 'express'

const app = express()

app.get('/', (req, res) => {
    const encoding = req.acceptsEncoding();
    res.json({ encoding });
});

app.get('/', (req, res) => {
    const encoding = req.acceptsEncoding('gzip');
    res.json({ encoding });
});

app.get('/', function (request, response) {
    const encoding = request.acceptsEncoding('gzip');
    response.json({ encoding });
});