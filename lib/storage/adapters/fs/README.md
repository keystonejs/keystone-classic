# File system storage adapter

This adapter is used for storing uploaded files on your local server.

## Usage

Configure the FS adapter:

```JS
var storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: keystone.expandPath('./uploads'), // required; path where the files should be stored
  		publicPath: '/public/uploads', // path where files should be exposed via the API
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

- **path**: _(string; required)_ Path the files will be storage at. Has to be absolute. (use `keystone.expandPath` like above to get the absolute path)
- **generateFilename**: _(function; default: random filename)_ Generate a filename for the uploaded file. Get's passed the `file`, the attempt number and the callback to call with the filename. *There is a small utility module for this, [`keystone-storage-namefunctions`](http://npm.im/keystone-storage-namefunctions), that allows you to assign random filenames, content hash filenames and original filenames. See its source for more information on how to write your own.*
- **whenExists**: _(string; default: 'retry')_ Specifies what to do when the file exists already. Can be one of `'retry'`, `'error'` or `'override'`.
- **retryAttempts**: _(number; default: 3)_ If `whenExists` is set to `'retry'`, how often keystone should retry the upload.
- **publicPath**: _(string)_ Path the files will be exposed at via the API.

### Schema

The FS adapter supports all the default Keystone file schema fields. It also additionally supports and enables

```JS
{
	filename: String,
}
```

because it stores its key in the name of a file on disk.
