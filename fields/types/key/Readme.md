# Key Field

`String` — Displayed as a text field in the Admin UI.

Automatically converts input to a valid key (no spaces or special characters). White space is replaced with a separator.

```js
  { type: Types.Key }
```

## Options

`separator` `String`
the separator to use when replace white space in the input; defaults to `-`.
