import express from 'express'

const app = express()

app.get('/', (req, res) => {
    const encoding = req.acceptsEncodings('gzip');
    res.json({ encoding }, 200);
});
