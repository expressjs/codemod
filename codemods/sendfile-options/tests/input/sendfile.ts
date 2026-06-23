import express from "express";

const app = express();
const serveHidden = true;

app.get('/a', (req, res) => {
  res.sendFile('index.html');
});

app.get('/b', (req, res) => {
  res.sendFile('index.html', { maxAge: '1d' });
});

app.get('/c', (req, res) => {
  res.sendFile('index.html', { dotfiles: 'deny' });
});

app.get('/d', (req, res) => {
  res.sendFile('file.html', { hidden: true });
});

app.get('/e', (req, res) => {
  res.sendFile('file.html', { hidden: false });
});

app.get('/f', (req, res) => {
  res.sendFile('file.html', { from: '/uploads' });
});

app.get('/g', (req, res) => {
  res.sendFile('file.html', { hidden: true, from: '/uploads', maxAge: '1d' });
});

app.get('/h', (req, res) => {
  res.sendFile('file.html', { hidden: serveHidden });
});

app.get('/callback', (req, res) => {
  res.sendFile('index.html', (err) => {
    if (err) console.error(err);
  });
});

app.get('/options-callback', (req, res) => {
  res.sendFile('index.html', { maxAge: '1d' }, (err) => {});
});

app.get('/variable-options', (req, res) => {
  const opts = { maxAge: '1d' };
  res.sendFile('index.html', opts);
});

const notRes = {
  sendFile(_path: string) {},
};
notRes.sendFile('index.html');
