# S3 File Field

> Warning: the S3 File Field has been deprecated. Please use the [File](/api/field/File) and a storage adapter going forward.


`Object` — Displayed as an file upload field in the Admin UI.

Automatically manages files stored in [Amazon S3](http://aws.amazon.com/s3), including uploading and deleting.

```js
  { type: Types.S3File }
```

## Options

### `s3path` `String`
the path to store uploaded files under in the S3 bucket

### `datePrefix` `String`
if set, prefixes the file name with the current date in this format (see moment.js for format options)

### `allowedTypes` `Array of String`
optional white-list of allowed mime types for uploaded files

### `filename` `Function`
function with arguments current model and client file name to return the new filename to upload.

```js
{
	type: Types.S3File,
	filename: function(item, filename){
		// prefix file name with object id
		return item._id + '-' + filename;
	}
}
```
### `headers` `Object` or `Array` or `Function`

Headers can be provided as an `Object`, in which the keys are used as header names and the values are used as header values.

```js
  {
    type: Types.S3File,
    headers: {
      'x-amz-meta-Cache-Control' : 'max-age=' + (60 * 15),
      'x-amz-meta-X-Custom-Header' : 'Object Option'
    }
  }
```
When the option is provided as an `Array` of headers, each header element in the array should be an `Object` with `name` and `value` `String` properties.

```js
  {
  	type: Types.S3File,
  	headers: [
  		{ name: 'x-amz-meta-Cache-Control', value: 'max-age=' + (60 * 15) },
  		{ name: 'x-amz-meta-X-Custom-Header', value: 'Array Option' }
  	]
  }
```

When the option is provided as a `Function`, the function will be called with arguments for the current model and client file; The function should return either an `Array` of valid header objects or a simple `Object`.

```js
  {
    type: Types.S3File,
    headers: function (item, file) {
      var headers = [];
      headers.push({ name: 'x-amz-meta-Cache-Control', value: 'max-age=' + item.maxAge });
      headers.push({ name: 'x-amz-meta-X-Custom-Header', value: 'Computed Option (Array)' });
      return headers;
    }
  }
  // or
  {
    type: Types.S3File,
    headers: function (item, file){
      var headers = {};
      headers['x-amz-meta-Cache-Control'] = 'max-age=' + item.maxAge;
      headers['x-amz-meta-X-Custom-Header'] = 'Computed Option (Object)';
      return headers;
    }
  }
```
### `format` `Function`
function with two arguments: current model and file object to return representation of this file in Admin UI.

```js
{
  type: Types.S3File,
  format: function(item, file){
    return '<pre>'+JSON.stringify(file, false, 2)+'</pre>'+
          '<img src="'+file.url+'" style="max-width: 300px">'
  }
}
```

## Schema

### `filename` `String`

### `type` `String`

### `filesize` `Number`

### `url` `String`

## Virtuals

### `exists` `Boolean`
whether there is a stored file

## Special paths

### `{path}_upload`
when a `file` is provided to the **updateHandler**, it will be uploaded to s3 and the details will be stored in the field.

## Underscore methods

`uploadFile(file, update, callback)`
uploads a file to the s3 bucket, stores the details in the field and provides the file data to the callback.

* `file` `File` should be a file as provided by express when a file is uploaded, i.e. req.files.path

* `update` `Boolean` whether to update the field with the details of the file after upload completes

* `callback(err, fileData)` - is passed the object that will be stored in the field (see schema above)
