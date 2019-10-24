# HTML Field

Stores a `String` in the model.
Displayed as a text field or WYSIWYG Editor in the Admin UI.

## Example

```js
{ type: Types.Html, wysiwyg: true }
```

## Options

- `wysiwyg` `Boolean`

Whether to display a WYSIWYG editor in the Admin UI - for customizations of the editor see the [Admin UI Options](http://v4.keystonejs.com/docs/configuration/#options-ui).

- `height` `Number`

The height of the field (in pixels).

See the [Admin UI Options](http://v4.keystonejs.com/docs/configuration#options-ui) for global configuration options that can be used to customise the WYSIWYG editor.

## Methods

### Inherits from [`Text`](../text)

- `addFilterToQuery`
- `validateInput`
- `validateRequiredInput`

## Filtering

Uses the same logic and filter UI as the [`Text`](../text) field type.
