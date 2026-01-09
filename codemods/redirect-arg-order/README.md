# Migrate legacy `res.redirect(url, status)`

Migrates usage of the legacy APIs `res.redirect(url, status)` to the new signature
`res.redirect(status, url)`. 

## Example

### Migrating `res.redirect(url, status)`

The migration involves replacing instances of `res.redirect(url, status)` with `res.redirect(status, url)`.

```diff
app.get('/some-route', (req, res) => {
  // Some logic here
- res.redirect(url, status);
+ res.redirect(status, url);
});
```

## References

- [Migration of res.redirect(url, status)](https://expressjs.com/en/guide/migrating-5.html#res.redirect)
