# Password Field

Stores a `String` in the model.

Displayed as a password field in the Admin UI, with a 'change' button.

Passwords are automatically encrypted with `bcrypt`, and expose a method to compare a string to the encrypted hash.

> Note: The encryption happens with a **pre-save hook** added to the **schema**, so passwords set will not be encrypted until an item has been saved to the database.

## Example

```js
{ type: Types.Password }
```

## Options

`workFactor` `Number`

Supplied as the `bcrypt` cost parameter; controls the computational cost of generating and validating a hash.
Higher values are slower but, since they take longer to generate, more secure against brute force attacks.

Defaults to `10`.
At this level, a modern laptop (Late 2016 MacBook Pro, 3.3 GHz Intel Core i7) can produce around ~4 hashes/second.

The `bcrypt` algorithim applies this value as a power of two.
As such, passwords with a workfactor of `11` will take twice as long to store and validate as those with a workfactor of `10`.

Values lower than `4` are ignored by the underlying implementation (a value `10` is substituted).

`min` `Number`

Defines the minimum allowed password length in characters.

Defaults to `8` in accordance with the [NIST Digital Identity Guidelines](http://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63b.pdf).

`max` `Number`

Defines the maximum allowed password length in characters.

The `bcrypt` algorithm, used by this field, operates on a 72 byte value.
Most implementation (including [the one we use](https://www.npmjs.com/package/bcrypt-nodejs)), silently truncate the string provided if it exceeds this limit.
The `max` length option defaults to 72 characters in an attempt to align with this limit.

> Note: If multi-byte (ie. non-ASCII) characters are allowed, it will be possible to exceed the 72 byte limit without triggering the 72 character validation limit.

Can be set to `false` to disable the max length check.

> Note: Disabling `max` or setting its value to >72 prevents validation errors but does not address the underlying algorithmic limitation.

`rejectCommon` `Boolean`

Controls whether values should be validated against a list of known-common passwords.

Defaults to `true` in accordance with the [NIST Digital Identity Guidelines](http://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63b.pdf).

Implemented with the [`dumb-passwords` package](https://www.npmjs.com/package/dumb-passwords)
which validates against 10,000 common passwords complied by [security analyst Mark Burnett](https://xato.net/10-000-top-passwords-6d6380716fe0).

`complexity` `Object`

Allows to set complexity requirements:

* `digitChar` `Boolean` - when set to `true`, requires at least one digit
* `spChar` `Boolean` - when set to `true`, requires at least one from the following special characters: `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(`, `)`, `+`
* `asciiChar` `Boolean` - when set to `true`, allows only ASCII characters (from range U+0020--U+007E)
* `lowChar` `Boolean` - when set to `true`, requires at least one lower case character
* `upperChar` `Boolean` - when set to `true`, requires at least one upper case character

Example:

```js
{ type: Types.Password, complexity: { digitChar: true, asciiChar: true } }
```


## Underscore methods

`compare(candidate, callback)` - encrypts the candidate and compares it against the encrypted hash

* `candidate` `String` to compare
* `callback(err, result)` - **result** is `true` if the candidate matches the stored password, or `false` if it doesn't

## Special paths

`{path}_compare` - when provided to the **updateHandler**, it will be checked against `{path}` and validation will fail if they don't match.
