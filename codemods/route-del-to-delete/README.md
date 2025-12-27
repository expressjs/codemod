# Migrate legacy `app.del()` to `app.delete()`

Migrates usage of the legacy APIs `app.del()` to `app.delete()`.
Initially, `del` was used instead of `delete`, because `delete` is a reserved keyword in JavaScript. However, as of ECMAScript 6, `delete` and other reserved keywords can legally be used as property names.

## Example

### Migrating `app.del()`

The migration involves replacing instances of `app.del()` with `app.delete()`.

```diff
- app.del('/some-route', (req, res) => {
+ app.delete('/some-route', (req, res) => {
    // Some logic here
 });
```

## References

- [Migration of app.del()](https://expressjs.com/en/guide/migrating-5.html#app.del)
