# Iframely Field

`Object` — Displayed as read-only data in the Admin UI.

Automatically retrieves data from the [Iframely](https://iframely.com/) API about the value of another field (specified with the `from` option).

It stores the retrieved data (which includes the provider, media type, full URL, HTML embed code, width, height, thumbnail picture and more).

The API call to retrieve the data is implemented as a pre-save hook, and is only triggered if the `from path` value has changed.

Follow the [Embed.ly configuration documentation](/configuration#embedly) for details on how to set up Iframely in KeystoneJS (it is an almost identical process).

```js
  { type: Types.Iframely, from: 'path' }
```

## Options

### `from` `String`
the path of another field in the Schema that will be passed to the Embedly API. The other field must contain a `String` value.

### `options` `Object`
(optional) - passed as arguments to the embedly API along with the `from` field value

See [Iframely's oEmbed API documentation](https://iframely.com/docs/oembed-api) for more information on options and returned data.

## Schema

### `exists` `Boolean`

### `type` `String`

### `title` `String`

### `url` `String`

### `width` `Number`

### `height` `Number`

### `version` `String`

### `description` `String`

### `html` `String`

### `authorName` `String`

### `authorUrl` `String`

### `providerName` `String`

### `thumbnailUrl` `String`

### `thumbnailWidth` `Number`

### `thumbnailHeight` `Number`
