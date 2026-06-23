import express from "express";

const app = express();
const serveHidden = true;

app.get('/a', (req, res) => {
  res.sendFile('index.html', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ });
});

app.get('/b', (req, res) => {
  res.sendFile('index.html', { maxAge: '1d', dotfiles: 'allow' /* Express 5: preserve v4 behavior */ });
});

app.get('/c', (req, res) => {
  res.sendFile('index.html', { dotfiles: 'deny' });
});

app.get('/d', (req, res) => {
  res.sendFile('file.html', { dotfiles: 'allow' });
});

app.get('/e', (req, res) => {
  res.sendFile('file.html', { dotfiles: 'ignore' });
});

app.get('/f', (req, res) => {
  res.sendFile('file.html', { root: '/uploads', dotfiles: 'allow' /* Express 5: preserve v4 behavior */ });
});

app.get('/g', (req, res) => {
  res.sendFile('file.html', { dotfiles: 'allow', root: '/uploads', maxAge: '1d' });
});

app.get('/h', (req, res) => {
  res.sendFile('file.html', { hidden: serveHidden });
});

app.get('/callback', (req, res) => {
  res.sendFile('index.html', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }, (err) => {
    if (err) console.error(err);
  });
});

app.get('/options-callback', (req, res) => {
  res.sendFile('index.html', { maxAge: '1d', dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }, (err) => {});
});

app.get('/variable-options', (req, res) => {
  const opts = { maxAge: '1d' };
  res.sendFile('index.html', opts);
});

const notRes = {
  sendFile(_path: string) {},
};
notRes.sendFile('index.html');
