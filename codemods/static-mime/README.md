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

The object Express 4 exposed as `express.static.mime` was a [`mime@1.x`](https://github.com/broofa/mime/tree/v1.6.0)
instance, whose API is **not** identical to `mime-types`. The codemod rewrites
each member accordingly:

| `express.static.mime` (mime@1.x) | `mime-types` | Handled by |
| --- | --- | --- |
| `.lookup(path)` | `.lookup(path)` | rename of the binding |
| `.extension(type)` | `.extension(type)` | rename of the binding |
| `.types` / `.extensions` | `.types` / `.extensions` | rename of the binding |
| `.charsets.lookup(type)` | `.charset(type)` | method rewrite |
| `.define(map)` | _no equivalent_ | flagged with a `TODO` comment |
| `.load(path)` | _no equivalent_ | flagged with a `TODO` comment |
| `.default_type` | _no equivalent_ | flagged with a `TODO` comment |

## Example

```diff
  import express from 'express'
+ import mime from 'mime-types'

- const type = express.static.mime.lookup('json')
+ const type = mime.lookup('json')
```

### Renamed method

```diff
- const charset = express.static.mime.charsets.lookup('text/html')
+ const charset = mime.charset('text/html')
```

### Methods without a `mime-types` equivalent

`define`, `load`, and `default_type` cannot be migrated automatically, so the
codemod points them at the new binding and flags them for manual review:

```diff
- express.static.mime.define({ 'text/x-custom': ['cstm'] })
+ mime.define({ 'text/x-custom': ['cstm'] }) /* TODO: 'mime-types' has no define(); migrate manually */
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

- Behavior differs slightly even for the shared methods: `mime-types` returns
  `false` for unknown input, whereas `mime@1.x` `lookup()` fell back to
  `default_type` (`application/octet-stream`). Review code that relied on that
  fallback.
- Members flagged with a `TODO` comment (`define`, `load`, `default_type`) have no
  `mime-types` equivalent and must be migrated by hand.
- Run `npm install` after the migration so the added `mime-types` dependency is installed.

## References

- [Express 5 Migration Guide - express.static.mime](https://expressjs.com/en/guide/migrating-5#express.static.mime)
- [`mime-types` package](https://github.com/jshttp/mime-types)
