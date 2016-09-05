# Twitter Field

Stores a `String` in the model.

## Methods

### `format`

Defaults to `stripUsername`. By default, strips twitter username from the value and returns it as string.

You can override the default formatter by providing a method as the `format` option on the field, or disable it by setting the format option to `false`.

### `validateInput`

Ensures the value, if provided, is a valid twitter username using `stripUsername` and regular expression `^@?(\w){1,15}$`.
Both `username` and `@username`, as well as twitter profile url with or without protocol are allowed.

### Inherits from [`Text`](../text)

* `addFilterToQuery`
* `validateRequiredInput`

## Filtering

Uses the same logic and filter UI as the [`Text`](../text) field type.
