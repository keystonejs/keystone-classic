# Date Field

Stores a `Date` in the model. Input is stripped to only store the Date part (no time).
Displayed as a date picker in the Admin UI

Internally uses [moment.js](http://momentjs.com/) to manage date parsing, formatting and comparison.

If the `utc` option is set, `moment(value).utc()` is called in all methods to enable moment's utc mode.

String parsing with moment will be done using the `inputFormat` option, which defaults to `"'YYYY-MM-DD'"`.

## Example

```js
{ type: Types.Date }
```

## Options
* `inputFormat` `String`

How the field interpret string input. See moment documentation for more information on available options.

Defaults to 'YYYY-MM-DD'

* `format` `String`

The default format pattern data will be returned in from the database.

Defaults to 'Do MMM YYYY'

See the [momentjs format docs](http://momentjs.com/docs/#/displaying/format/) for information on the supported formats and options.

* `todayButton` `Boolean`

Determines if the Today button will be displayed.

Defaults to 'true'

## Methods

### `format(formatString)`

Formats the stored value using [momentjs](http://momentjs.com/), with the provided format string.

`formatString` defaults to the `format` option, which defaults to `"Do MMM YYYY"`.

If no `formatString` is provided and the `format` option is false, the stored value will be returned.

When the stored value is `undefined`, an empty string is returned.

### `moment`

Returns a [momentjs](http://momentjs.com/) instance initialised with the value stored in the item.

### `parse(value, formatString)`

Parses input using [momentjs](http://momentjs.com/). Returns a moment instance initialised with the provided value. `formatString` defaults to the `inputFormat` option.

See the [momentjs parse docs](http://momentjs.com/docs/#/parsing/) for information on the supported formats and options for the `parse` method.

Example:

```js
item.createdDate = Date.now();
item._.createdDate.format(); // returns today's date using the default format string
item._.createdDate.parse('2013-12-04'); // returns a moment object with the parsed date
item._.createdDate.format('YYYY-MM-DD'); // returns '2013-12-04'
```

### `updateItem`

Updates with the provided value if it is different from the stored value.

Uses `this.parse()` to interpret the input as a date.

`null` and `""` can be used to clear the stored value.

### `validateInput`

Ensures the value, if provided, is either a Date object, a number that can be interpreted as epoch time, or a string that can be parsed into a valid date by moment.

Allows `null` and `""` to clear the field value.

### Inherits from [`Text`](../text)

* `validateRequiredInput`

## Filtering

Accepts either value or before +/ after depending on the mode. Can be inverted.

```
{
	after: Date,
	before: Date,
	inverted: Boolean,
	mode: String enum ['on', after', 'before', 'between'],
	value: Date,
}
```

Inverting the filter finds all items **not** matching the value.

Default filter arguments are:

```
{
	after: '',
	before: '',
	inverted: false,
	mode: 'on',
	value: '',
}
```

### Modes

* `on`

  Items with the day of the `value` in the field's path will be found. An empty `value` will match items containing `null` or `""` stored in the field path.

* `after`

  Items after the end of the day of `after` in the field's path will be found. `after` must be a valid date.

* `before`

  Items before the start of the day of `after` in the field's path will be found. `before` must be a valid date.

* `between`

  Items after the start of the day of `after` AND before the end of the day of `before` in the field's path will be found. Both `after` and `before` must be a valid date.

## Notes

* Input should either be a valid **Date**, or a string in the format **YYYY-MM-DD** (can be blank unless field is required).
* To default Date fields to the current time, set the `default` option to `Date.now`.
