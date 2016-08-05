# URL Field

Stores a `String` in the model.
Displayed as a text field in the Admin UI.

```js
  { type: Types.Url }
```

## Methods

### `format`

Defaults to `removeProtocolPrefix`. Strips any protocol from the value using the regular expression `^[a-zA-Z]+\:\/\/` and returns a string.

## Options

### `format`

You can override the default formatter by providing a method as the `format` option on the field, or disable it by setting the format option to `false`.

```js
  item.url = "http://keystonejs.com";
  item._.url.format(); // "keystonejs.com"
```

## Inherits from [`Text`](../text)

* `addFilterToQuery`
* `validateInput`
* `validateRequiredInput`

## Filtering

Uses the same logic and filter UI as the [`Text`](../text) field type.
