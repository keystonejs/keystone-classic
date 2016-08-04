# Number Field

Stores a `Number` in the model.
Displayed as a number field in the Admin UI.

Input should either be a valid **Number**, or a string that can be converted to a number (can be blank unless field is required).

## Example

```js
{ type: Types.Number }
```

## Methods

### `format(formatString)`

Formats the value as a string.

If the field's `format` option is a string (defaults to `"0,0[.][000000000000]"` but can be set to `false`), **or** the `formatString` argument is provided, the value is formatted with [numeral.js](http://numeraljs.com).

### `validateInput`

Ensures that the value is either a number, or a string that can be interpreted as a number (see the `number(arg)` method in [keystone-utils](https://github.com/keystonejs/keystone-utils#conversion-utilities)).

Allows `null` and `""` to clear the field value.

### `validateRequiredInput`

Ensures that the value is either a number or a string that can be interpreted as a string, and is not zero.
