# File system storage adapter

This adapter is used for storing uploaded files on your server's local filesystem.

## Usage

Configure the FS adapter:

```JS
var storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: keystone.expandPath('./uploads'), // required; path where the files should be stored
  		publicPath: '/public/uploads', // path where files will be served
	}
});
```

Then use it as a storage provider for a File field:

```JS
MyList.add({
	file: { type: Types.File, storage: myStorage },
});
```

### Options

The adapter requires an additional `fs` field added to the storage options. it accepts the following values:

- **path**: _(string; required)_ Path the files will be stored at on disk
- **generateFilename**: _(function; default: random filename)_ Method to generate a filename for the uploaded file. Gets passed the `file` data, the attempt number and the callback to call with the filename.
  - See [`keystone-storage-namefunctions`](http://npm.im/keystone-storage-namefunctions) for additional filename generators, including content hash filename and original filename. See its source for more information on how to write your own.
- **whenExists**: _(string; default: 'retry')_ Specifies what to do when the file exists already. Can be one of `'retry'`, `'error'` or `'overwrite'`.
- **retryAttempts**: _(number; default: 3)_ If `whenExists` is set to `'retry'`, how many times keystone should try to generate a unique filename before returning an error
- **publicPath**: _(string)_ Optional path the files will served from by the webserver

### Schema

The FS adapter supports all the default Keystone file schema fields. It also additionally supports and enables the `filename` path (required).

```JS
{
	filename: String,
}
```
