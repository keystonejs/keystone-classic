# URL Field

Stores a `String` in the model.

## Methods

### `format`

By default, strips any protocol from the value using the regular expression `^[a-zA-Z]+\:\/\/` and returns a string.

You can override the default formatter by providing a method as the `format` option on the field, or disable it by setting the format option to `false`.

### Inherits from [`Text`](../text)

* `addFilterToQuery`
* `validateInput`
* `validateRequiredInput`

## Filtering

Uses the same logic and filter UI as the [`Text`](../text) field type.
