# Markdown Field

Object - Displayed as a textarea field in the Admin UI.

Stores a nested structure in the model with the properties:

```
{
  html: String,
  md: String,
}
```

The `html` path is updated when the `md` path is set by [Marked](https://github.com/chjj/marked)

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
