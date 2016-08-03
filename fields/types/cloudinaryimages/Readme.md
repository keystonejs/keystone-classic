# CloudinaryImages Field

`Array` — Displayed as a series of images, and an upload field in the Admin UI.

Stores multiple images in a array as a nested `Schema`, each of which expose the same methods as the `cloudinaryimage` field.

```js
  { type: Types.CloudinaryImages }
```

## Options

`folder` `String` specifies a custom folder/prefix for the Cloudinary image `public_id` when `cloudinary folders` is set to `true`.

```js
  { type: Types.CloudinaryImages, folder: 'path/to/image' }
```

> Note: If you want Cloudinary to automatically create folders when the cloudinary folders option is set to true, make sure you enable "Auto-create folders" in your Cloudinary account "Upload Settings".
