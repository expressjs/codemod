import staticExpress from "express";
import * as expressNS from "express";
import otherLib from "other-lib";

const expressRequire = require("express");

const aliasedExpress = staticExpress;

const app = {
  use() {},
};

app.use(staticExpress.static('aliased', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }));

app.use(
  staticExpress.static(
    'multi-line',
    {
      maxAge: '1d',
      dotfiles: 'allow' /* Express 5: preserve v4 behavior */
    }
  )
);

app.use(
  staticExpress.static(
    'multi-line-options',
    {
      root: '/uploads',
      dotfiles: 'allow',
    }
  )
);

app.use(expressNS.static('namespace', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }));

app.use(expressRequire.static('commonjs', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }));

app.use(require("express").static('direct-require', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }));

// Not express: must be left untouched.
app.use(otherLib.static('not-express'));

// Indirect alias (assignment, not import/require): conservatively left untouched.
app.use(aliasedExpress.static('indirect-alias'));
