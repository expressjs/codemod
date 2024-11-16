import express from 'express'

const app = express()

app.get('/', (req, res) => {
    const encoding = req.acceptsLanguage('gzip');
    res.json({ encoding });
});

app.get('/', function (request, response) {
    const encoding = request.acceptsLanguage('gzip');
    response.json({ encoding });
});

