# Migrate legacy `res.redirect('back')` and `res.location('back')`

Migrates usage of the legacy APIs `res.redirect('back')` and `res.location('back')`
to use the recommended approach of accessing the `Referer` header directly from
the request object. Versions of Express before 5 allowed the use of the string
"back" as a shortcut to redirect to the referring page, but this has been
deprecated.

## Example

### Migrating `res.redirect('back')`

The migration involves replacing instances of `res.redirect('back')` with `res.redirect(req.get('Referer') || '/')`.

```diff
app.get('/some-route', (req, res) => {
  // Some logic here
- res.redirect('back');
+ res.redirect(req.get('Referer') || '/');
});
```

### Migrating `res.location('back')`

The migration involves replacing instances of `res.location('back')` with `res.location(req.get('Referer') || '/')`.

```diff
app.get('/some-route', (req, res) => {
  // Some logic here
- res.location('back');
+ res.location(req.get('Referer') || '/');
});
```

## References

- [Migration of res.redirect('back') and res.location('back')](https://expressjs.com/en/guide/migrating-5.html#magic-redirect)
