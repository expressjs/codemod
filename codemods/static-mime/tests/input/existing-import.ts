import express from "express";
import mt from "mime-types";

express.static.mime.lookup('json');

mt.contentType('html');
