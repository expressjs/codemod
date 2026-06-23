import express from "express";
import mime from 'mime-types';

const jsonType = mime.lookup('json');

const charset = mime.charset('text/html');

const ext = mime.extension('application/json');

mime.define({ 'text/x-custom': ['cstm'] }) /* TODO: 'mime-types' has no define(); migrate manually */;

mime.load('./custom.types') /* TODO: 'mime-types' has no load(); migrate manually */;

const fallback = mime.default_type /* TODO: 'mime-types' has no default_type; migrate manually */;
