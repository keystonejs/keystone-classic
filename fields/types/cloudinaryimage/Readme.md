# CloudinaryImage Field

> Warning: the CloudinaryImage Field has been deprecated. Please use the [File](/field/File) and a storage adapter going forward.
Stores an `Object` in the model.

Displayed as an image upload field in the Admin UI.

Automatically manages images stored in [Cloudinary](http://cloudinary.com/), including uploading, resizing and deleting.

See the [Cloudinary configuration documentation](http://keystonejs.com/docs/configuration#services-cloudinary) for details on how to set up Cloudinary in KeystoneJS.

## Example

```js
{ type: Types.CloudinaryImage }
```

## Options

`generateFilename` `function; default: random filename`

Method to generate a public_id in Cloudinary for the uploaded file. Gets passed the `file` data, the attempt number and the callback to call with the filename. Note: Cloudinary supported file extensions will automatically be removed from returned filename.
  - See [`keystone-storage-namefunctions`](http://npm.im/keystone-storage-namefunctions) for additional filename generators, including content hash filename and original filename. See its source for more information on how to write your own.

```js
{ type: Types.CloudinaryImage, generateFilename: function(file, attemptNumber, callback) {
    var originalname = file.originalname;
    var filenameWithoutExtension = originalname.substring(0, originalname.lastIndexOf('.'));
    var timestamp = new Date().getTime();
    return `${filenameWithoutExtension}-${timestamp}`;
  },
}
```

`whenExists` `string; default: 'overwrite'`

Specifies what to do when the file exists already. Can be one of `'retry'`, `'error'` or `'overwrite'`.

```js
{ type: Types.CloudinaryImage, whenExists: 'retry' }
```

`retryAttempts` `number; default: 3`

If `whenExists` is set to `'retry'`, how many times keystone should try to generate a unique filename before returning an error

```js
{ type: Types.CloudinaryImage, whenExists: 'retry', retryAttempts: 5 }
```

`folder` `String`

Specifies a custom folder/prefix for the Cloudinary image `public_id` when `cloudinary folders` is set to `true`.

```js
{ type: Types.CloudinaryImage, folder: 'path/to/image' }
```

> Note: If you want Cloudinary to automatically create folders when the `cloudinary folders` option is set to `true`, make sure you enable "Auto-create folders" in your Cloudinary account "Upload Settings".

`autoCleanup` `Boolean`

When `true`, changes Keystone's default behavior from `remove` (which only removes the Cloudinary image from the database) to `delete` (which removes the image from both the database and Cloudinary storage). Additionally, this option replaces an existing image (if one already exists) during upload. This only occurs on calls to [updateItem](/api/list/update-item)

```js
{ type: Types.CloudinaryImage, autoCleanup : true }
```

`select` `Boolean`

When `true`, a select field is displayed with a list of images currently available in Cloudinary storage. Only images with IDs that begin with the `selectPrefix` will be displayed when the `selectPrefix` is specified. Otherwise, images with IDs that begin with the folder will be displayed. If neither `selectPrefix` nor `folder` are configured, then only images with IDs that begin with `[{prefix}]/{list.path}/{field.path}/` will be displayed.

```js
{ type: Types.CloudinaryImage, select : true }
```

`selectPrefix` `String` specifies the the prefix of the images that will be available for selection when `select` option is `true`.

```js
{ type: Types.CloudinaryImage, select: true, selectPrefix: 'path/to/images' }
```

## Schema

`public_id` `String`

`version` `Number`

`signature` `String`

`format` `String`

`resource_type` `String`

`url` `String`

`width` `Number`

`height` `Number`

`secure_url` `String`

## Virtuals

`exists` `Boolean` - whether there is a stored image

## Special paths

`{path}_upload`

When a `file` is provided to the **updateHandler**, it will be uploaded to cloudinary and the details will be stored in the field.

## Underscore methods

`src(options)` `String` - returns the url of the image, accepts all options cloudinary supports

`tag(options)` `String` - returns an `<img>` tag

`scale(width, height, options)` `String` - scales the image to fit the exact width and height, retaining aspect ratio

`fit(width, height, options)` `String` - scales the image to fit within the specified width and height, retaining aspect ratio

`lfit(width, height, options)` `String` - scales the image to fit within the specified width and height, retaining aspect ratio (without exceeding the original dimensions)

`limit(width, height, options)` `String` - scales the image (down only) to fit within the specified width and height, retaining aspect ratio

`fill(width, height, options)` `String` - scales the image to fill the specified width and height

`crop(width, height, options)` `String` - crops the image to fill the specified width and height

`pad(width, height, options)` `String` - pads the image to fill the specified width and height

`lpad(width, height, options)` `String` - pads the image to fill the specified width and height (without exceeding the original dimensions)

`thumbnail(width, height, options)` `String` - crops the image to fill the specified width and height

In all methods, `options` is an optional `Object`. See [Cloudinary's Transformation Documentation](http://cloudinary.com/documentation/image_transformations) for more information on the supported options and transformations.

> Note: Remember that if you are uploading images to a `CloudinaryImage` field using an HTML form, you need to specify `enctype="multipart/form-data"` in your `form` tag.
