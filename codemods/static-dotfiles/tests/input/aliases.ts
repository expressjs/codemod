import staticExpress from "express";
import * as expressNS from "express";
import otherLib from "other-lib";

const expressRequire = require("express");

const aliasedExpress = staticExpress;

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

app.use(
  staticExpress.static(
    'multi-line-options',
    {
      from: '/uploads',
      hidden: true,
    }
  )
);

app.use(expressNS.static('namespace'));

app.use(expressRequire.static('commonjs'));

app.use(require("express").static('direct-require'));

// Not express: must be left untouched.
app.use(otherLib.static('not-express'));

// Indirect alias (assignment, not import/require): conservatively left untouched.
app.use(aliasedExpress.static('indirect-alias'));
