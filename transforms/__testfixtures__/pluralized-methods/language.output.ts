import express from 'express'

const app = express()

app.get('/', (req, res) => {
    const encoding = req.acceptsLanguages('gzip');
    res.json({ encoding }, 200);
});

