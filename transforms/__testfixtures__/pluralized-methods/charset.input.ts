import express from 'express'

const app = express()

app.get('/', (req, res) => {
    const charset = req.acceptsCharset('utf-8');
    res.json({ charset }, 200);
});

