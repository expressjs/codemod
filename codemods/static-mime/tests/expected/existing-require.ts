const express = require("express");
const mimeTypes = require("mime-types");

const jsonType = mimeTypes.lookup('json');

mimeTypes.contentType('html');
