# AzureFile Field

> Warning: the AzureFile Field has been deprecated. Please use the [File](/field/File) and a storage adapter going forward.

Stores as an `Object` in the model.
Displayed as a file upload field in the Admin UI.

Automatically manages files stored in [Windows Azure Storage](http://www.windowsazure.com/), including uploading and deleting.

## Example

```js
{ type: Types.AzureFile }
```
## Options

`filenameFormatter` `Callback`

Function with arguments current model and client file name to return the new filename to upload.

```js
{ type: Types.AzureFile, filenameFormatter: function(item, filename) {
	return item._id + require('path').extname(filename);
} }
```

`containerFormatter` `Callback`

Function with arguments current model and client file name to return the new container name (container are a root folder in Azure Storage Account).

```js
{ type: Types.AzureFile, containerFormatter: function(item, filename) {
	return item.modelProperty;
} }
```

## Schema

`filename` `String`

`type` `String`

`filesize` `Number`

`url` `String`

`etag` `String`

## Virtuals

`exists` `Boolean` - whether there is a stored file

## Underscore methods

`uploadFile(file, update, callback)`

Uploads a file to the Azure Storage Account, stores the details in the field and provides the file data to the callback.

* `file` `File` - should be a file as provided by express when a file is uploaded, i.e. `req.files.path`
* `update` `Boolean` - whether to update the field with the details of the file after upload completes
* `callback(err, fileData)` - is passed the object that will be stored in the field (see schema above)
