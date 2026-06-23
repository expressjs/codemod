import express from "express";

const jsonType = express.static.mime.lookup('json');

const charset = express.static.mime.charsets.lookup('text/html');

const ext = express.static.mime.extension('application/json');

express.static.mime.define({ 'text/x-custom': ['cstm'] });

express.static.mime.load('./custom.types');

const fallback = express.static.mime.default_type;
