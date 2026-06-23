import express from "express";

const jsonType = express.static.mime.lookup('json');

express.static.mime.charset('text/html');

const ext = express.static.mime.extension('application/json');

express.static.mime.define({ 'text/x-custom': ['cstm'] });
