# Migrate `express.static.mime`

In Express 5, `mime` is no longer an exported property of `express.static`. The
[`mime-types` package](https://github.com/jshttp/mime-types) should be used to
work with MIME type values instead.

This codemod rewrites every `express.static.mime` reference to use a `mime-types`
binding and adds the corresponding import/require to the file:

1. Replaces `express.static.mime` with a `mime-types` local binding (default name `mime`).
2. Adds the import once per file, matching how `express` is imported
   (`import mime from 'mime-types'` for ESM, `const mime = require('mime-types')` for CommonJS).
3. Reuses an existing `mime-types` import when the file already has one, and falls
   back to a non-colliding name (`mimeTypes`) when `mime` is already taken.

## Example

```diff
  import express from 'express'
+ import mime from 'mime-types'

- const type = express.static.mime.lookup('json')
+ const type = mime.lookup('json')
```

### CommonJS

```diff
  const express = require('express')
+ const mime = require('mime-types')

- express.static.mime.lookup('json')
+ mime.lookup('json')
```

### `package.json`

For projects that depend on `express`, the codemod also adds `mime-types` to the
same dependency section, so the newly referenced package is declared:

```diff
  "dependencies": {
-   "express": "^5.0.0"
+   "express": "^5.0.0",
+   "mime-types": "^3.0.0"
  }
```

An existing `mime-types` entry is left untouched, and `package.json` files without
`express` are not modified.

## Notes

- The `mime-types` package is not API-compatible with the `mime@1.x` instance that
  Express 4 exposed through `express.static.mime`. Methods such as `lookup`,
  `extension`, `charset`, `contentType`, `types`, and `extensions` are available,
  but `define`, `load`, and `default_type` are not. Review usages of those methods
  after running the codemod.
- Run `npm install` after the migration so the added `mime-types` dependency is installed.

## References

- [Express 5 Migration Guide - express.static.mime](https://expressjs.com/en/guide/migrating-5#express.static.mime)
- [`mime-types` package](https://github.com/jshttp/mime-types)
