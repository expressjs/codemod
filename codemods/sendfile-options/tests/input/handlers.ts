const express = require("express");
const app = express();

app.get('/multi', function (req, res) {
  res.sendFile(
    'index.html',
    {
      maxAge: '1d',
    }
  );
});

app.use((req, res, next) => {
  res.sendFile('error.html');
});

function handler(req, res) {
  res.sendFile('page.html', { from: '/pages' });
}
