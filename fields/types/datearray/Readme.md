# Datearray field

Stores an `Array` of `Dates` in the model.

## Options

### `separator` `String`

Used to join the strings in the array to create a single formatted value.

Defaults to `" | "`;

### `parseFormat` `String`

The default date format, defaults to `"'YYYY-MM-DD'"`

### `format` `String`

The default format pattern to use, defaults to `"'Do MMM YYYY'"`

## Methods

### `format(formatString, separator)`

Formats the stored value using [momentjs](http://momentjs.com/), with the provided format string.

`formatString` defaults to the `format` option, which defaults to `"Do MMM YYYY"`.

If no `formatString` is provided and the `format` option is false, the stored value will be returned.

When the stored value is `undefined`, an empty string is returned.

Concatenates all values with the `separator` argument and returns a string.

### `validateInput`

Ensures the value, if provided, is either a Date object, a number that can be interpreted as epoch time, or a string that can be parsed into a valid date by moment.

Allows `null` and `""` to clear the field value.

### `validateRequiredInput`

Ensures a value has been provided, and it is either an epoch time, or a string that can be parsed into a valid date, or an array of such.
