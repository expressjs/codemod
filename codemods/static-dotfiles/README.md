# Migrate `express.static` options

Express 5 changes several `express.static` options:

- The `dotfiles` option now defaults to `"ignore"` (Express 4 served dotfiles by default). Files inside a directory that starts with a dot (`.`), such as `.well-known`, will no longer be accessible and will return a 404 Not Found error.
- The `hidden` option is removed and replaced by `dotfiles`.
- The `from` option (an undocumented alias for `root`) is removed and replaced by `root`.

This codemod updates `express.static()` calls to preserve the Express 4 behavior:

1. Adds an explicit `dotfiles: 'allow'` option to calls that don't already specify a `dotfiles` (or `hidden`) option.
2. Renames `hidden` to `dotfiles` (`hidden: true` → `dotfiles: 'allow'`, `hidden: false` → `dotfiles: 'ignore'`).
3. Renames `from` to `root`.

## Example

```diff
- app.use(express.static('public'))
+ app.use(express.static('public', { dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }))
```

### With existing options

```diff
- app.use(express.static('public', { maxAge: '1d' }))
+ app.use(express.static('public', { maxAge: '1d', dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }))
```

### Removed `hidden` option

```diff
- app.use(express.static('public', { hidden: true }))
+ app.use(express.static('public', { dotfiles: 'allow' }))
```

### Removed `from` option

```diff
- app.use(express.static('uploads', { from: '/uploads' }))
+ app.use(express.static('uploads', { root: '/uploads', dotfiles: 'allow' /* Express 5: preserve v4 behavior */ }))
```

## Security Consideration

After running this codemod, review each `express.static()` call to determine if serving dotfiles is actually necessary for your application. If you don't need to serve dotfiles, you can:

1. Remove the `dotfiles: 'allow'` option to use the new Express 5 default (`"ignore"`)
2. Or explicitly set `dotfiles: 'deny'` to return a 403 Forbidden for dotfile requests

For directories like `.well-known` that need to be served (e.g., for Android App Links or Apple Universal Links), consider serving them explicitly:

```javascript
app.use('/.well-known', express.static('public/.well-known', { dotfiles: 'allow' }))
app.use(express.static('public'))
```

## References

- [Express 5 Migration Guide - express.static dotfiles](https://expressjs.com/en/guide/migrating-5#expressstatic-options)
