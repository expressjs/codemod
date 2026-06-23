import express from "express";

const types = express.static.mime.types;

const extensions = express.static.mime.extensions;

const jsonType = express.static.mime.types['json'];
