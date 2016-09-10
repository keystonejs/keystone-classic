# `DateTime` Field

Stores a `String` of both date and time in the model.
Displayed as a date and time picker in the Admin UI.  

Internally uses [moment.js](http://momentjs.com/) to manage date parsing, formatting and comparison.

If the `utc` option is set, `moment(value).utc()` is called in all methods to enable moment's utc mode.

String parsing with moment will be done using the `parseFormat` option, which defaults to `"'YYYY-MM-DD h:m:s a'"`.

## Example

```js
{ type: Types.Datetime, default: Date.now }
```

## Options

* `format` `string`

The default format pattern to use, defaults to `Do MMM YYYY hh:mm:ss a`

See the [momentjs format docs](http://momentjs.com/docs/#/displaying/format/) for information on the supported formats and options.

## Methods

### `updateItem`

Updates with the provided value if it is different from the stored value.

Uses the `Date` field `parse` method to interpret the input as a date.

`null` and `""` can be used to clear the stored value.

### `validateInput`

Ensures the value, if provided, is either a Date object, a number that can be interpreted as epoch time, or a string that can be parsed into a valid date by [momentjs](http://momentjs.com/).

Allows `null` and `""` to clear the field value.

### Inherits from [`Date`](../date)

- `format()`
- `moment()`
- `addFilterToQuery()`
- `parse()`

### Inherits from [`Text`](../text)

- `validateRequiredInput()`

## Filtering

Uses the same logic and filter UI as the [`Date`](../date) field type.

## Notes

Input should either be a valid **Date**, or a string in the format `YYYY-MM-DD` (can be blank unless field is required)

To default Date fields to the current time, set the `default` option to `Date.now`
