# File Field

The File fields stores a file using Keystone Storage and a Storage Adapter (e.g. `FS`, `S3`, etc). You have to configure a `Storage` instance first then provide it in the options for the field, e.g.

Storage adapters are built per field. Look up the documentation on the individual adapters.

```js
var storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: 'uploads',
		publicPath: '/public/uploads/',
	}
});
MyList.add({
	file: { type: Types.File, storage: storage }
});
```

The field stores a nested `Object` in the model. The nested schema is based on the schema provided by the Storage Adapter, which for the `FS` adapter defaults to:

```js
{
	filename: String,
	size: Number,
	mimetype: String,
	path: String,
	originalname: String,
	url: String,
}
```

Different adapters may add additional paths to the field schema - see the documentation for the Adapter you're using for more information.

## Updates

```js
file.updateItem(item, data, files, ({ err }) => { /* done */ })
```

The update method requires an item, update data, files and a callback. `files` is optional unless a file is being uploaded.

Update data must be an object containing a value with the field's path (can be nested or flattened). Uploaded files must be provided in the `files` argument (which is securely provided by Multer when processing requests) and referenced in the value of the field.

The examples below are based on updating an item with the following List configuration:

```js
MyList.add({
	file: { type: Types.File, storage: storage }
});
```

### Update the field value

```js
file.updateItem(item, {
	file: {
		filename: 'xyz123.jpg',
		size: '43233',
		mimetype: 'image/jpeg',
		path: '/public/uploads',
		originalname: 'photo.jpg',
		url: '/uploads/xyz123.jpg',
	}
});
```

### Upload a new file (result will be stored in the field)

To upload a new file, you can use either updateItem, or you can use the upload method below.

```js
file.updateItem(item, {
	// data object contains a reference to a path in the files object
	file: 'upload:az12xy89',
}, {
	// files object contains file fields as processed by multer
	az12xy89: {
		originalname,
		mimetype,
		size,
		path,
	}
});
```

The `path` option is the only required option when you're uploading, and it must be the path of the file stored on the server to upload to your storage provider.

### Remove the file

To delete the stored file and reset the field value, provide the strong `"remove"`:

```js
{
	file: 'remove',
}
```

### Reset the field value

To reset the field value _without_ deleting the stored file, provide an empty / `null` value:

```js
{
	file: '',
}
```

## Methods

### `upload`

This method uploads a file using your storage provider. You can call it directly on the list:

```js
List.fields.fieldName.upload({
	path: '/path/to/temporary/file.txt',
}, (err) => { /* done */ });
```

or you can call it using an underscore method on an item:

```js
item._.fieldName.upload({
	path: '/path/to/temporary/file.txt',
}, (err) => { /* done */ });
```

The options parameter can accept any options that are passed in normally by multer. It expects at a minimum the `path` property when you're uploading; the other fields are optional. A full example object looks like this:

```js
{
	filename: 'xyz123.jpg',
	size: '43233',
	mimetype: 'image/jpeg',
	path: '/public/uploads',
	originalname: 'photo.jpg',
	url: '/uploads/xyz123.jpg',
}
```

There is no way to upload directly from a buffer at the moment, you must upload from a file.

### `remove`

Calls the `removeFile` on the storage adapter provided.

### `reset`

Resets all fields in the storage schema.
