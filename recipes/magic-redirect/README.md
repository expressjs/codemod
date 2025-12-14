# Migrate legacy `res.redirect('back')` and `res.location('back')`

Migrates usage of the legacy APIs `res.redirect('back')` and `res.location('back')` to use the recommended approach of accessing the `Referer` header directly from the request object.

## Example

### Migrating `res.redirect('back')`

#### Before

```js
app.get('/some-route', (req, res) => {
  // Some logic here
    res.redirect('back');
});
```

#### After

```js
app.get('/some-route', (req, res) => {
  // Some logic here
    res.redirect(req.get('Referer') || '/');
});
```

### Migrating `res.location('back')`

#### Before

```js
app.get('/some-route', (req, res) => {
  // Some logic here
    res.location('back');
});
```

#### After

```js
app.get('/some-route', (req, res) => {
  // Some logic here
    res.location(req.get('Referer') || '/');
});
```