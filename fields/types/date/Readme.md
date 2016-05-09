# Date Field

Stores a `Date` in the model. Input is stripped to only store the Date part (no time).

Internally uses [moment.js](http://momentjs.com/) to manage date parsing, formatting and comparison.

If the `utc` option is set, `moment(value).utc()` is called in all methods to enable moment's utc mode.

String parsing with moment will be done using the `inputFormat` option, which defaults to `"'YYYY-MM-DD'"`.

## Methods

### `format(formatString)`

Formats the stored value using moment, with the provided format string.

`formatString` defaults to the `format` option, which defaults to `"Do MMM YYYY"`.

If no `formatString` is provided and the `format` option is false, the stored value will be returned.

When the stored value is `undefined` an empty string is returned.

### `moment`

Returns a moment instance initialised with the value stored in the item.

### `parse(value, formatString)`

Returns a moment instance initialised with the provided value. `formatString` defaults to the `inputFormat` option.

### `updateItem`

Updates with the provided value if it is different from the stored value.

Uses `this.parse()` to interpret the input as a date.

`null` and `""` can be used to clear the stored value.

### `validateInput`

Ensures the value, if provided, is either a Date object, a number that can be interpreted as epoch time, or a string that can be parsed into a valid date by moment.

Allows `null` and `""` to clear the field value.

### Inherits from [`Text`](../text)

* `validateRequiredInput`
