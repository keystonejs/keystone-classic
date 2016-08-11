# `keystone.Storage`

Oftentimes sites will need to store some files. In order to make this happen for a wide variety of filetypes and services, we've made a generic API (`keystone.Storage`) which is pluggable and can be integrated with _adapters_. Adapters allow you to connect your storage instance to a specific service.

## Usage

This is the usage with the most basic adapter, the filesystem (FS) adapter. (this is the only built-in adapter)

First, configure a new storage instance to use the FS adapter:

```JS
var myStorage = new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
  	path: keystone.expandPath('./uploads'),
  	publicPath: '/public/uploads',
  },
});
```

Then create a new Field with a type of `File` and pass in the storage adapter you just created:

```JS
MyList.add({
	file: { type: Types.File, storage: myStorage },
});
```

Congratulations, your users can now upload files to your local server!

> For a full list of options for the FS storage adapter see the [FS adapter documentation](./adapters/fs/README.md)!

## Adapters

Currently available adapters are:

- FS: _(built-in)_ Use via `keystone.Storage.Adapters.FS`
- S3: Use via [`keystone-storage-adapter-s3`](http://npm.im/keystone-storage-adapter-s3) npm module
- Azure: Use via [`keystone-storage-adapter-azure`](http://npm.im/keystone-storage-adapter-azure) npm module

## Schema

The storage adapter has a schema. These paths will be persisted to the database and represent the value of the file field.

These are the paths of the schema:

```
var SCHEMA_TYPES = {
	size: Number,           // on by default; the size of the file
	mimetype: String,       // on by default; the mime type of the file
	path: String,           // the path (e.g directory) the file is stored in; not the full path to the file
	originalname: String,   // the original (uploaded) name of the file; useful when filename generated
	url: String,            // publicly accessible URL of the stored file
};
```

**Only `size` and `mimetype` are enabled by default!** You can override these like so:

```JS
var myStorage = new keystone.Storage({
  adapter: yourAdapter,
  schema: {
  	originalname: true,
  	url: true,
  },
});
```

These must be supported by the adapter! (though the adapter can also use the default schema implementation) Please check the documentation of the adapter you use for more information.

