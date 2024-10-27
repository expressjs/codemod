import express from 'express'

const app = express()

app.get('/', (req, res) => {
    const encoding = req.acceptsLanguage('gzip');
    res.json({ encoding }, 200);
});

