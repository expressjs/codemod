import express from "express";
import * as mimeTypes from "mime-types";

const jsonType = express.static.mime.lookup('json');

mimeTypes.contentType('html');
