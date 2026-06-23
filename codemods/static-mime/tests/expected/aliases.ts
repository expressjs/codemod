import staticExpress from "express";
import mime from 'mime-types';
import * as expressNS from "express";
import otherLib from "other-lib";

mime.lookup('a');

mime.charset('text/css');

// Not express: must be left untouched.
otherLib.static.mime.lookup('b');
