# Textarea Field

Stores a `String` in the model.
Displayed as a textarea field in the Admin UI.

```js
  { type: Types.Textarea }
```

## Methods

### `format`

Uses the `textToHTML()` method in [keystone-utils](https://github.com/keystonejs/keystone-utils#conversion-utilities) to convert the value to HTML.

## Options

### `height` `Number`
the height of the field (in pixels)

### Inherits from [`Text`](../text)

* `addFilterToQuery`
* `crop`
* `validateInput`
* `validateRequiredInput`

## Filtering

Uses the same logic and filter UI as the [`Text`](../text) field type.
