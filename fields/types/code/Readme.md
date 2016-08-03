# Code Field

Stores a `String` in the model.
Displayed with CodeMirror in the Admin UI.

## Example

```js
{ type: Types.Code, height: 180, language: json }
```

## Options

`height` `Number`
The height of the field (in pixels). Default: 180

`language` `String`
The language in the code field.

Supported languages:
`c++, objectivec, css, asp, c, vb, xml, php, html, ini, js, java, coffee, lisp, perl, python, sql, json, less, sass, sh, ruby, jsp, tpl, jade`

## Methods

### Inherits from [`Text`](../text)

* `addFilterToQuery`
* `validateInput`
* `validateRequiredInput`

## Filtering

Uses the same logic and filter UI as the [`Text`](../text) field type.
