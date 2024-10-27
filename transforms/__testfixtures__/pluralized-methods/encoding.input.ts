import express from 'express'

const app = express()

app.get('/', (req, res) => {
    const encoding = req.acceptsEncoding('gzip');
    res.json({ encoding }, 200);
});
