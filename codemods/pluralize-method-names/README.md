# Migrate pluralized request methods

Migrates deprecated request methods to their pluralized versions that were deprecated in Express 4 and removed in Express 5.

## Example

### Migrating `req.acceptsCharset(charset)`

The migration involves replacing instances of `req.acceptsCharset(charset)` with `req.acceptsCharsets(charset)`.

```diff
app.get('/', (req, res) => {
- const charset = req.acceptsCharset('utf-8');
+ const charset = req.acceptsCharsets('utf-8');
  res.json({ charset });
});
```
### Migrating `req.acceptsEncoding(encoding)

The migration involves replacing instances of `req.acceptsEncoding(encoding)` with `req.acceptsEncodings(encoding)`.

```diff
app.get('/', (req, res) => {
- const encoding = req.acceptsEncoding('gzip');
+ const encoding = req.acceptsEncodings('gzip');
  res.json({ encoding });
});
```

### Migrating `req.acceptsLanguage(language)`

The migration involves replacing instances of `req.acceptsLanguage(language)` with `req.acceptsLanguages(language)`.

```diff
app.get('/', (req, res) => {
- const language = req.acceptsLanguage('en');
+ const language = req.acceptsLanguages('en');
  res.json({ language });
});
```

## References

- [Migration of pluralized request methods](https://expressjs.com/en/guide/migrating-5.html#plural)
