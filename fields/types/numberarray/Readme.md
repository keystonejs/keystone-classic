# NumberArray field

Stores an `Array` of `Number` values in the model.

## Example

```js
{ type: Types.NumberArray }
```

## Options

`separator` `string` - is used to join values; defaults to `' | '`

## Underscore methods

`format(formatString, separator)` - formats the stored value to `string` using [numeraljs](http://numeraljs.com/), according to the format string provided.

Defaults to `0,0[.][000000000000]` and can be set to `false` to disable automatic formatting.
