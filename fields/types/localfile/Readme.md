# LocalFile Field

> Warning: the LocalFile Field has been deprecated. Please use the [File](/field/File) and a storage adapter going forward.

`Object` — Displayed as a file upload field in the Admin UI

Stores files on the local file system.

```js
  { type: Types.LocalFile }
```

> Note: This field type is not compatible with PAAS Hosts like Heroku because it relies on the local file system

## Options

### `dest` `String`
required, the path to store uploaded file

### `prefix` `String`
the path prefix in browser, if it different with `dest`

### `datePrefix` `String`
if set, prefixes the file name with the current date in this format (see moment.js for format options)

### `allowedTypes` `Array` of `String`
optional white-list of allowed mime types for uploaded file

### `filename` `Function`
function with two arguments: current model and file object to return the new filename to upload.

```js
{
  type: Types.LocalFile,
  dest: '/data/files',
  prefix: '/files/',
  filename: function(item, file){
    return item.id + '.' + file.extension
  }
}
```
### `format` `Function`
function with two arguments: current model and file object to return representation of this file in Admin UI.

```js
{
  type: Types.LocalFile,
  dest: '/data/files',
  prefix: '/files/',
  format: function(item, file){
    return '<img src="/files/'+file.filename+'" style="max-width: 300px">'
  }
}
```

## Schema

### `filename` `String`
### `path` `String`
### `size` `Number`
### `filetype` `String`

## Virtuals

### `exists` `Boolean`
whether there is a file path stored

## Underscore methods

### `uploadFile(file, update, callback)`
uploads a file to the local storage, stores the details in the field and provides the file data to the callback.

* `file` `File` should be a file as provided by express when a file is uploaded, i.e. `req.files.path`

* `update` `Boolean` whether to update the field with the details of the file after upload completes

* `callback(err, fileData)` - is passed the object that will be stored in the field (see schema above)
