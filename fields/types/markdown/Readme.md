# Markdown Field

Stores a nested structure in the model with the properties:

```
{
  html: String,
  md: String,
}
```

The `html` path is updated when the `md` path is set by [Marked](https://github.com/chjj/marked)

## Methods

### `format`

Returns the html value.

### Inherits from [`Text`](../text)

* `validateInput`
* `validateRequiredInput`
