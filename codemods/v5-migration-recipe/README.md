# Migrate recipes for Express.js v5

This codemod migration recipe helps you update your Express.js v4 applications to be compatible with Express.js v5 by addressing deprecated APIs.

Included transformations:

- **Back Redirect Deprecated**: This transformation updates instances of `res.redirect('back')` and `res.location('back')` to use the recommended alternatives. Registry entry: [https://app.codemod.com/registry/@expressjs/back-redirect-deprecated](https://app.codemod.com/registry/@expressjs/back-redirect-deprecated).
- **Explicit Request Params**: Migrates usage of the legacy API `req.param(name)` to the current recommended alternatives. Registry entry: [https://app.codemod.com/registry/@expressjs/explicit-request-params](https://app.codemod.com/registry/@expressjs/explicit-request-params).
- **Pluralize Method Names**: Migrates deprecated singular request methods to their pluralized counterparts where applicable. Registry entry: [https://app.codemod.com/registry/@expressjs/pluralize-method-names](https://app.codemod.com/registry/@expressjs/pluralize-method-names).
- **Status Send Order**: Migrates usages of `res.send(status)`, `res.send(obj, status)`, `res.json(obj, status)`, and `res.jsonp(obj, status)` to the recommended argument ordering. Registry entry: [https://app.codemod.com/registry/@expressjs/status-send-order](https://app.codemod.com/registry/@expressjs/status-send-order).
- **Redirect Arg Order**: Converts `res.redirect(url, status)` calls to the recommended `res.redirect(status, url)` ordering. Registry entry: [https://app.codemod.com/registry/@expressjs/redirect-arg-order](https://app.codemod.com/registry/@expressjs/redirect-arg-order).
- **Camelcase Sendfile**: Replaces legacy `res.sendfile(file)` usages with the camel-cased `res.sendFile(file)` API. Registry entry: [https://app.codemod.com/registry/@expressjs/camelcase-sendfile](https://app.codemod.com/registry/@expressjs/camelcase-sendfile).
- **Route Del to Delete**: Migrates usage of the legacy APIs `app.del()` to `app.delete()`. Registry entry: [https://app.codemod.com/registry/@expressjs/route-del-to-delete](https://app.codemod.com/registry/@expressjs/route-del-to-delete).

## References

- [Express.js v5 Migration Guide](https://expressjs.com/en/guide/migrating-5)
