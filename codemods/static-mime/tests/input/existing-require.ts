const express = require("express");
const mimeTypes = require("mime-types");

const jsonType = express.static.mime.lookup('json');

mimeTypes.contentType('html');
