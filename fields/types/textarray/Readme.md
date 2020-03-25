# TextArray Field

Stores an `Array` of `String` values in the model.

```js
{ type: Types.TextArray }
```

## Options

### `separator` `String`

Used to join the strings in the array to create a single formatted value.

Defaults to `" | "`;

## Methods

### `format(separator)`

Concatenates all values with the `separator` argument and returns a string.

`separator` defaults to the option specified for the field.

### `updateItem(item, data, callback)`

Updates the item with the provided value. Simple values will be wrapped in an Array, and values in the array will be coerced into Strings before saving.

### `validateInput`

Ensures the value, if provided, is an Array of Strings (or a single String value).

Allows `null` to clear the field value.

### `validateRequiredInput`

Ensures a value has been provided. Empty strings are not valid.

## Filtering

Accepts a value, mode, and presence. It can also be case sensitive.

When presence is `"some"`, items with the value in the array (one or more times) are matched. When presence is `"none"`, items that do not have the value in the array are matched.

```
{
	caseSensitive: Boolean,
	mode: String enum ['contains', 'exactly', 'beginsWith', 'endsWith'],
	presence: String enum ['some', 'none']
	value: String,
}
```

Default filter arguments are:

```
{
	caseSensitive: false,
	mode: 'contains',
	presence: 'some',
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
