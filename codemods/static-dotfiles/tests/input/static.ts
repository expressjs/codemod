import express from "express";

const app = express();

app.use(express.static('public'));

app.use(express.static('assets'));

app.use('/files', express.static('uploads'));

app.use(express.static('public', { maxAge: '1d' }));

app.use(express.static('public', { index: false, maxAge: 86400000 }));

app.use(express.static('public', { dotfiles: 'deny' }));

app.use(express.static('public', { dotfiles: 'allow', maxAge: '1d' }));

const staticPath = './static';
app.use(express.static(staticPath));

app.use(express.static(__dirname + '/public'));
