# Password Field

Stores a `String` in the model.

Displayed as a password field in the Admin UI, with a 'change' button.

Passwords are automatically encrypted with bcrypt, and expose a method to compare a string to the encrypted hash.

> Note: The encryption happens with a **pre-save hook** added to the **schema**, so passwords set will not be encrypted until an item has been saved to the database.

## Example

```js
{ type: Types.Password }
```

## Options

`workFactor` `Number`

The bcrypt workfactor to use when generating the hash, higher numbers are slower but more secure (defaults to `10`).

`complexity` `Object`

Allows to set complexity requirements:

* `digitChar` `Boolean` - when set to `true`, requires at least one digit
* `spChar` `Boolean` - when set to `true`, requires at least one from the following special characters: !, @, #, $, %, ^, &, \*, (, ), +
* `asciiChar` `Boolean` - when set to `true`, allows only ASCII characters (from range U+0020--U+007E)
* `lowChar` `Boolean` - when set to `true`, requires at least one lower case character
* `upperChar` `Boolean` - when set to `true`, requires at least one upper case character

### Example

```js
{ type: Types.Password, complexity: { digitChar: true, asciiChar: true } }
```

`max` `Number`

Sets the maximum password length; defaults to 72, in accordance with [bcrypt](https://www.google.com/search?q=bcrypt+max+length), which truncates the password to the first 72 bytes.

Can be set to `false` to disable the max length.

> Note: Disabling `max` or setting its value to >72 does not override the bcrypt specification.

`min` `Number`

Defines the minimum password length; disabled by default.

## Underscore methods

`compare(candidate, callback)` - encrypts the candidate and compares it against the encrypted hash

* `candidate` `String` to compare
* `callback(err, result)` - **result** is `true` if the candidate matches the stored password, or `false` if it doesn't

## Special paths

`{path}_compare` - when provided to the **updateHandler**, it will be checked against `{path}` and validation will fail if they don't match.
