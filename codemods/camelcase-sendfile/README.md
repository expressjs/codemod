# Migrate legacy `res.sendfile(file)` to `res.sendFile(file)`

Migrates usage of the legacy APIs `res.sendfile(file)` to `res.sendFile(file)`.

## Example

### Migrating `res.sendfile(file)`

The migration involves replacing instances of `res.sendfile(file)` with `res.sendFile(file)`.

```diff
app.get('/some-route', (req, res) => {
  // Some logic here
- res.sendfile('/path/to/file');
+ res.sendFile('/path/to/file');
});
```

## References

- [Migration of res.sendfile(file)](https://expressjs.com/en/guide/migrating-5.html#res.sendFile)