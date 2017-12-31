# DateTime Field

Stores a `String` of both date and time in the model.
Displayed as a date and time picker in the Admin UI.

Internally uses [moment.js](http://momentjs.com/) to manage date parsing, formatting and comparison.

If the `utc` option is set, `moment(value).utc()` is called in all methods to enable moment's utc mode.

String parsing with moment will be done using the `dateFormat`, `timeFormat` and `tzFormat` options which default to
`'YYYY-MM-DD'`, `'h:mm:ss a'` and `'Z'` respectively.

## Example

```js
{ type: Types.Datetime, default: Date.now }
```

## Options

* `parseFormat` `string`

The default pattern to read in values with. This pattern is added to the below array of default values along with the
format specified in the `dateFormat`, `timeFormat` and `tzFormat` options.

This option option need only be specified if you require format(s) that don't appear below and don't match the display
format.

`['YYYY-MM-DD', 'YYYY-MM-DD h:m:s a', 'YYYY-MM-DD h:m a', 'YYYY-MM-DD H:m:s', 'YYYY-MM-DD H:m', 'YYYY-MM-DD h:mm:s a Z', moment.ISO_8601]`

* `dateFormat` `string`

The default format pattern to use when displaying the date portion of the value. Defaults to `YYYY-MM-DD`

See the [momentjs format docs](http://momentjs.com/docs/#/displaying/format/) for information on the supported formats and options.

* `timeFormat` `string`

The default format pattern to use when displaying the time portion of the value. Defaults to `h:mm:ss a`

See the [momentjs format docs](http://momentjs.com/docs/#/displaying/format/) for information on the supported formats and options.

* `dateFormat` `string`

The default format pattern to use when displaying the timezone offset portion of the value. Defaults to `Z`

See the [momentjs format docs](http://momentjs.com/docs/#/displaying/format/) for information on the supported formats and options.

* `utc` `boolean`

Sets whether the string should be displayed in the admin UI in UTC time or local time. Defaults to `false`.

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
