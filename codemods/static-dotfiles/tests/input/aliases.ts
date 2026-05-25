import staticExpress from "express";
import * as expressNS from "express";

const expressRequire = require("express");

const app = {
  use() {},
};

app.use(staticExpress.static('aliased'));

app.use(
  staticExpress.static(
    'multi-line',
    {
      maxAge: '1d',
    }
  )
);

app.use(expressNS.static('namespace'));

app.use(expressRequire.static('commonjs'));

app.use(require("express").static('direct-require'));
