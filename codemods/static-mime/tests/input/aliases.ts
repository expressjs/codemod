import staticExpress from "express";
import * as expressNS from "express";
import otherLib from "other-lib";

staticExpress.static.mime.lookup('a');

expressNS.static.mime.charset('text/css');

// Not express: must be left untouched.
otherLib.static.mime.lookup('b');
