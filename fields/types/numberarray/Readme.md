# NumberArray field

Stores an `Array` of `Number` values in the model.

## Example

```js
{ type: Types.NumberArray }
```

## Options

`separator` `string` - is used to join values; defaults to `' | '`

## Underscore methods

`format(formatString, separator)` - concatenates and formats the stored values to `string` using [numeraljs](http://numeraljs.com/), according to the format string provided.

Defaults to `0,0[.][000000000000]` and can be set to `false` to disable automatic formatting.

`separator` defaults to the value of `separator` option.

## Methods

`validateInput` - checks if user input values are either `Number` values or `String` values containing numbers.

Allows `null`, `undefined` and `""` values.
