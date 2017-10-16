# Markdown Field

Object - Displayed as a textarea field in the Admin UI.

Stores a nested structure in the model with the properties:

```
{
  html: String,
  md: String,
}
```

When the `md` path is set, the value is first sanitized using [`sanitize-html`](https://github.com/punkave/sanitize-html), then rendered into HTML using [`marked`](https://github.com/chjj/marked).
(Options for both these packages can be provided in the field definition, see below.)
The resultant HTML is persisted as `html`.

## Options

`height` `Number`

Defines the height of the markdown editor; defaults to 90.

```js
{ type: Types.Markdown, height: 200 }
```

`toolbarOptions` `Object`

Allow customizations of the toolbar.

`toolbarOptions.hiddenButtons` `String`

Comma separated list of buttons to hide.

```js
{ type: Types.Markdown, toolbarOptions: { hiddenButtons: 'H1,H6,Code' } }
```

`markedOptions` `Object`

Supplied as options to the [`marked`](https://github.com/chjj/marked) package.
If not supplied the field will inherit the [package defaults](https://github.com/chjj/marked#options-1).

`sanitizeOptions` `Object`

Supplied as options to the [`sanitize-html`](https://github.com/punkave/sanitize-html) package.
If not supplied the field will inherit the [package defaults](https://github.com/punkave/sanitize-html#what-are-the-default-options).

## Schema

The markdown field will automatically convert markdown to html when the `md` property is changed, via a setter on the `md` path.

`md` `String` - source markdown text

`html` `String` - generated html code

```js
Page.add({ content: Types.Markdown });

var page = new Page.model();
page.content.md = "# Hello World";
page.content.html == "<h1>Hello World</h1>";

// or...

Page.fields.content.updateItem(page, "* list item");
page.fields.content.format(page) == "<ul><li>list item</ul></li>";
```

## Methods

### `format`

Returns the html value.

### Inherits from [`Text`](../text)

* `validateInput`
* `validateRequiredInput`
