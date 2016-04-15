# Select Field

Stores a `String` or `Number` in the model. Behaves similarly to an `Enum`.

## Methods

### `format`

Returns the `label` property of the selected option, or `""`.

### `updateItem`

If `numeric`, strings are coerced to number values.

The value `null` will always remove the value from the item. An empty string will remove the value from the item, _unless_ there is an option with the value of `""`.

### `validateInput`

Ensures the value, if provided, is a valid option. If `numeric`, strings are coerced to number values first.

Allows `null` and `""` to clear the field value.

### `validateRequiredInput`

Ensures a value has been provided. Empty strings are never valid, even if specified in the `options` array.
