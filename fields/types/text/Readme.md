# Text Field

Stores a `String` in the model.
Displayed as a text field in the Admin UI.

```js
	{ type: Types.Text }
```

## Options

`min` `Number` - sets the minimum character length of the field

`max` `Number` - sets the maximum character length of the field

```js
{ type: Types.Text, min: 10, max: 2000 }
```

## Methods

### `crop(length, append, preserveWords)`

Uses the `cropString()` method from [keystone-utils](https://github.com/keystonejs/keystone-utils#conversion-utilities) to crop the value to the specified length.

### `format`

Simply returns the stored string, or an empty string if the value is `undefined`.

_This is the default implementation in `Type`._

### `updateItem`

Updates with the provided value if it is different from the stored value. All types will be coerced to the schema type by mongoose, so `!=` is used to compare with existing values in the item before the new value is set. When `null` is passed, mongoose will remove the path from the stored document and the value will be `undefined` when the item is next retrieved.

_This is the default implementation in `Type`._

### `validateInput`

Ensures the value, if provided, is a string.

Allows `null` to clear the field value.

### `validateRequiredInput`

Ensures a value has been provided. Empty strings are not valid.

## Filtering

Accepts a value, mode, and can be inverted. It can also be case sensitive.

```
{
	inverted: Boolean,
	caseSensitive: Boolean,
	mode: String enum ['contains', 'exactly', 'beginsWith', 'endsWith'],
	value: String,
}
```

An empty `value` will match items containing `null` or `""` stored in the field path.

Inverting the filter finds all items **not** matching the value.

Default filter arguments are:

```
{
	inverted: false,
	caseSensitive: false,
	mode: 'contains',
	value: '',
}
```

### Modes

* `contains` (default)

  Items containing the provided `value` at the field's path will be found using a regular expression.

* `exactly`

  Items with exactly the provided `value` at the field's path will be found.

* `beginsWith`

  Items with the provided `value` at the start of the stored value at field's path will be found using a regular expression.

* `endsWith`

  Items with the provided `value` at the end of the stored value at field's path will be found using a regular expression.
