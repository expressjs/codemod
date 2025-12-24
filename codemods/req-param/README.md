# Migrate legacy `req.param(name)`

The `req.param(name)` helper that used to magically look up values from multiple places has been removed. This potentially confusing and dangerous method of retrieving form data has been removed. You will now need to specifically look for the submitted parameter name in the `req.params`, `req.body`, or `req.query` object.

## Examples

### Replacing `req.param('body')` and `req.param('query')`

Replace `req.param('body')` with `req.body` and
`req.param('query')` with `req.query`.

```diff
app.get('/', (req, res) => {
  // Before
- const reqBody = req.param('body');
- const reqQuery = req.param('query');
  // After
+ const reqBody = req.body;
+ const reqQuery = req.query;
});
```

### Replacing `req.param('paramName')`

Replace `req.param('paramName')` with `req.params.paramName`.

```diff
app.get('/user/:id', (req, res) => {
  // Before
- const userId = req.param('id');
  // After
+ const userId = req.params.id;
});
```

## References

- [Migration of `req.param()`](https://expressjs.com/en/guide/migrating-5.html#req.param)
