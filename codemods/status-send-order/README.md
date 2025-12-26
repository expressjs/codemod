# Migrate legacy `res.send(obj, status)`, `res.send(status)`,  `res.json(obj, status)` and `res.jsonp(obj, status)`

Migrates usage of the legacy APIs `res.send(obj, status)`, `res.json(obj, status)`, and `res.jsonp(obj, status)` to use the recommended approach of specifying the status code
using the `res.status(status).send(obj)`, `res.status(status).json(obj)`, and
`res.status(status).jsonp(obj)` methods respectively. The older APIs that allowed
specifying the status code as a second argument have been deprecated.

## Example

### Migrating `res.send(obj, status)`

The migration involves replacing instances of `res.send(obj, status)` with `res.status(status).send(obj)`.

```diff
app.get('/some-route', (req, res) => {
  // Some logic here
- res.send(obj, status);
+ res.status(status).send(obj);
});
```

### Migrating `res.json(obj, status)`

The migration involves replacing instances of `res.json(obj, status)` with `res.status(status).json(obj)`.

```diff
app.get('/some-route', (req, res) => {
  // Some logic here
- res.json(obj, status);
+ res.status(status).json(obj);
});
```
### Migrating `res.jsonp(obj, status)`

The migration involves replacing instances of `res.jsonp(obj, status)` with `res.status(status).jsonp(obj)`.

```diff
app.get('/some-route', (req, res) => {
  // Some logic here
- res.jsonp(obj, status);
+ res.status(status).jsonp(obj);
});
```

### Migrating `res.send(status)`

The migration involves replacing instances of `res.send(status)` with `res.sendStatus(status)`.

```diff
app.get('/some-route', (req, res) => {
  // Some logic here
- res.send(status);
+ res.sendStatus(status);
});
```

## References

- [Migration of res.send(status)](https://expressjs.com/en/guide/migrating-5.html#res.send.status)
- [Migration of res.send(obj, status)](https://expressjs.com/en/guide/migrating-5.html#res.send.body)
- [Migration of res.json(obj, status)](https://expressjs.com/en/guide/migrating-5.html#res.json)
- [Migration of res.jsonp(obj, status)](https://expressjs.com/en/guide/migrating-5.html#res.jsonp)
