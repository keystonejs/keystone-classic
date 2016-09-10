# `keystone.Storage`

> The new Storage API in KeystoneJS 0.4+ is replacing the `azureFile`, `localFile`, `localFiles` and `s3File` fields from KeystoneJS 0.3.x. If you use these field types in your project, you'll need to replace them with the new `File` field type and the appropriate storage adapter.

Often sites will need to store some files. In order to make this happen for a wide variety of filetypes and services, we've made a generic API (`keystone.Storage`) which is pluggable and can be integrated with different file backends via _adapters_. Adapters allow you to connect your storage instance to a specific service.

## Usage

This is the usage with the most basic adapter, the filesystem (FS) adapter. (this is the only built-in adapter)

First, configure a new storage instance to use the FS adapter:

```js
var myStorage = new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
  	path: keystone.expandPath('./uploads'),
  	publicPath: '/public/uploads',
  },
});
```

Then create a new Field with a type of `File` and pass in the storage adapter you just created:

```js
MyList.add({
	file: { type: Types.File, storage: myStorage },
});
```

Congratulations, your users can now upload files to your local server!

> For a full list of options for the FS storage adapter see the [FS adapter documentation](./adapters/fs)

## Adapters

Currently available adapters are:

- FS: _(built-in)_ Use via `keystone.Storage.Adapters.FS`
- S3: Use via [`keystone-storage-adapter-s3`](http://npm.im/keystone-storage-adapter-s3) npm module
- Azure: Use via [`keystone-storage-adapter-azure`](http://npm.im/keystone-storage-adapter-azure) npm module

## Schema

The storage adapter provides the schema for the `File` field. These paths will be persisted to the database and represent the value of the file field.

These are the paths of the schema:

```
var SCHEMA_TYPES = {
	size: Number,           // on by default; the size of the file
	mimetype: String,       // on by default; the mime type of the file
	path: String,           // the path (e.g directory) the file is stored in; not the full path to the file
	originalname: String,   // the original (uploaded) name of the file; useful when filename is generated
	url: String,            // publicly accessible URL of the stored file
};
```

Adapters also provide schema paths that are specific to the service the adapter integrates with. For example, `FS`, `Azure` and `S3` all add `filename: String` to the schema.

**Note that not all schema paths are enabled by default!** You can specify which paths should be included by setting keys in the `schema` options:

```js
var myStorage = new keystone.Storage({
  adapter: yourAdapter,
  schema: {
    originalname: true,
    url: true,
  },
});
```

The defaults for which scheme paths are enabled are:

```js
{
  size: true,
  mimetype: true,
  path: false,
  originalname: false,
  url: false,
};
```
