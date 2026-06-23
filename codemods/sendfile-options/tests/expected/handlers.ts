const express = require("express");
const app = express();

app.get('/multi', function (req, res) {
  res.sendFile(
    'index.html',
    {
      maxAge: '1d',
      dotfiles: 'allow' /* Express 5: preserve v4 behavior */
    }
  );
});

app.use((req, res, next) => {
  res.sendFile('error.html', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ });
});

function handler(req, res) {
  res.sendFile('page.html', { root: '/pages', dotfiles: 'allow' /* Express 5: preserve v4 behavior */ });
}
