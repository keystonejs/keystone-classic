# `DateTime` Field

Stores a `String` of both date and time in the model.

Internally uses [moment.js](http://momentjs.com/) to manage date parsing, formatting and comparison.

If the `utc` option is set, `moment(value).utc()` is called in all methods to enable moment's utc mode.

String parsing with moment will be done using the `parseFormat` option, which defaults to `"'YYYY-MM-DD h:m:s a'"`.

## Methods

### `updateItem`

Updates with the provided value if it is different from the stored value.

Uses the `Date` field `parse` method to interpret the input as a date.

`null` and `""` can be used to clear the stored value.

### `validateInput`

Ensures the value, if provided, is either a Date object, a number that can be interpreted as epoch time, or a string that can be parsed into a valid date by moment.

Allows `null` and `""` to clear the field value.

### Inherits from `Date`

- [`format()`](../date)
- [`moment()`](../date)
- [`addFilterToQuery()`](../date)
- [`parse()`](../date)

### Inherits from `Text`

- [`validateRequiredInput()`](../text)
