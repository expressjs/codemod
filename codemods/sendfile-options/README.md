# Migrate `res.sendFile` options

Express 5 changes several `res.sendFile` options, mirroring the `express.static`
changes:

- The `dotfiles` option now also applies to hidden **directories** in the path, not
  just hidden files. In Express 4 a hidden directory in the path was served by
  default; Express 5 returns a **404 Not Found** unless you opt in with
  `dotfiles: 'allow'`.
- The `hidden` option is removed and replaced by `dotfiles`.
- The `from` option (an undocumented alias for `root`) is removed and replaced by `root`.

This codemod updates `res.sendFile()` calls to preserve the Express 4 behavior:

1. Adds an explicit `dotfiles: 'allow'` option to calls that don't already specify a `dotfiles` (or `hidden`) option.
2. Renames `hidden` to `dotfiles` (`hidden: true` → `dotfiles: 'allow'`, `hidden: false` → `dotfiles: 'ignore'`).
3. Renames `from` to `root`.

Only calls whose receiver is a response object (a route/middleware handler
parameter, e.g. the `res` in `(req, res) => res.sendFile(...)`) are rewritten.

## Example

```diff
  app.get('/build', (req, res) => {
-   res.sendFile('/var/www/app/.cache/index.html')
+   res.sendFile('/var/www/app/.cache/index.html', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ })
  })
```

### With existing options

```diff
- res.sendFile('index.html', { maxAge: '1d' })
+ res.sendFile('index.html', { maxAge: '1d', dotfiles: 'allow' /* Express 5: preserve v4 behavior */ })
```

### Removed `hidden` / `from` options

```diff
- res.sendFile(req.params.name, { hidden: true, from: '/uploads' })
+ res.sendFile(req.params.name, { dotfiles: 'allow', root: '/uploads' })
```

### With a trailing callback

The options object is inserted before the callback:

```diff
- res.sendFile('index.html', (err) => next(err))
+ res.sendFile('index.html', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }, (err) => next(err))
```

## Security Consideration

After running this codemod, review each `res.sendFile()` call to determine if
serving dotfiles is actually necessary for your application. If you don't need to
serve dotfiles, you can:

1. Remove the `dotfiles: 'allow'` option to use the new Express 5 default (`"ignore"`)
2. Or explicitly set `dotfiles: 'deny'` to return a 403 Forbidden for dotfile requests

Note that passing a `root` option scopes the `dotfiles` check to the part of the
path relative to `root`, so a hidden directory in `root` itself is unaffected.

## References

- [Express 5 Migration Guide - res.sendFile() options](https://expressjs.com/en/guide/migrating-5#ressendfile-options)
