# Update Handler

## `var updateHandler = new updateHandler(list:KeystoneList, item:MongooseObject, req:RequestObject, options:Object)`

Update Handler is a constructor from a collection of complex objects, to allow you to update an item, and return flash errors to the user. It is mostly used internally by keystone, however if you wish to use flash errors, it is accessible. behind the scenes its process method uses the [updateItem](/api/list/update-item) property on the passed in list. Its arguments are:

argument | description
--- | ---
list | A keystone list, retrieved with [keystone.list](/api/methods/list). This is the list of the item you want to update.
item | A mongoose object retrieved from the database.
req | A request object provided to us by express. If there is a user on the request object, this will be added to the options when the data is processed. If there are files on the request object, they will be added to the options object.
options | The options object has two purposes. It will be passed in to the `updateItem` call, and also supports several options of its own, detailed below.

<h4 data-primitive-type="Mixed"><code>flashErrors</code></h4>

Determines whether the req object should have flash errors added to it for when the return occurs and there are errors. Accepts a boolean, defaulting to false. it also accepts the strings `validation` or `update`, which limit what errors are returned as flash errors.

The type of each flash error is `error`, and it returns an object with `type`, `title` and `list`, which includes the body of the errors.

<h4 data-primitive-type="String"><code>errorMessage</code></h4>

The errorMessage to include with the flashErrors. This will be defaulted to `'There was a problem saving your changes'` if none was provided.

<h4 data-primitive-type="Boolean"><code>logErrors</code></h4>

If this is true, a console error will be printed when there is an error in processing the data.

## process

`updateHandler.process(data:Object[, options:Object], callback:Function)`

A method on an updateHandler. When called, it processes the update, using the data passed in. It can also take in an options object, which is mapped to the options passed into the udpateHandler's creation.

The `updateItem` function is used to process the update.
