# Name Field

`Object` — Displayed as **firstname lastname** fields in the Admin UI.

```js
  { type: Types.Name }
```

## Schema

The name field adds `first` and `last` `String` paths to the schema, as well as a `full` virtual getter and setter.

If it is updated with a string, it will split it into first and last name based on the first space.

### `first` `String`
first name

### `last` `String`
last name

## Virtuals

### `full` `String`
first and last name, concatenated with a space (if both have a value).
The `name.full` setter splits input at the first space.
