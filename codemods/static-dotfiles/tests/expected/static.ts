import express from "express";

const app = express();

app.use(express.static('public', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }));

app.use(express.static('assets', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }));

app.use('/files', express.static('uploads', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }));

app.use(express.static('public', { maxAge: '1d', dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }));

app.use(express.static('public', { index: false, maxAge: 86400000, dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }));

app.use(express.static('public', { dotfiles: 'deny' }));

app.use(express.static('public', { dotfiles: 'allow', maxAge: '1d' }));

const staticPath = './static';
app.use(express.static(staticPath, { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }));

app.use(express.static(__dirname + '/public', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }));
