import express from 'express'

const app = express()

app.get('/', (req, res) => {
    const encoding = req.acceptsEncodings('gzip');
    res.json({ encoding });
});

app.get('/', function (request, response) {
    const encoding = request.acceptsEncodings('gzip');
    response.json({ encoding });
});