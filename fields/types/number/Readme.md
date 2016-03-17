# Number Field

Stores a `Number` in the model.

## Methods

### `format`

If `options.format` is set to false it'll return the number as a string. If that's not the case, it is formatted with a `numeral.js` format string. The default format string is `'0,0[.][000000000000]'`, but you can pass the the function a custom one.

### `validateInput`

Ensures that the value is either a number, a numerical string, `null`, `undefined` or `""`.

### `validateRequiredInput`

Ensures that the value is either a number or a numerical string that's not empty.
