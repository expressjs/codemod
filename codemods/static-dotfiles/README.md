# Migrate `express.static` dotfiles behavior

In Express 5, the `express.static` middleware's `dotfiles` option now defaults to `"ignore"`. This is a change from Express 4, where dotfiles were served by default. As a result, files inside a directory that starts with a dot (`.`), such as `.well-known`, will no longer be accessible and will return a 404 Not Found error.

This codemod adds an explicit `dotfiles: 'allow'` option to `express.static()` calls that don't already specify a `dotfiles` option, preserving the Express 4 behavior.

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

- [Express 5 Migration Guide - express.static dotfiles](https://expressjs.com/en/guide/migrating-5.html#express.static.dotfiles)
