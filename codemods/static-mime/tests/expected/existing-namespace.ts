import express from "express";
import * as mimeTypes from "mime-types";

const jsonType = mimeTypes.lookup('json');

mimeTypes.contentType('html');
