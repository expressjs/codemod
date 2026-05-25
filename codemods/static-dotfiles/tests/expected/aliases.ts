import staticExpress from "express";
import * as expressNS from "express";

const expressRequire = require("express");

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

app.use(expressNS.static('namespace', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }));

app.use(expressRequire.static('commonjs', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }));
