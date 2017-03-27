# Update Item

## updateItem(item:Object, data:Object, options:Object, callback:Function)

A method to update an item that will apply keystone's internal validators before attempting to update, to ensure data integrity.

- `item`: the mongo object that you want to save. Note that the `.save()` function from mongoose will be called on it, so only properly created objects will be properly persisted, otherwise an error will be thrown.
- `data`: the data you want to update. The keys will be validated against the matching keys on the model, then the values will be updated. Providing a key with a value of `null` or an emptry string will clear that field. Fields that are undefined will be ignored.
- `options`: an object with options for updateItem specifically.
- `callback`: The callback is called with any errors as the first argument, and does not return anything other than any errors.

The options available are:

<h4 data-primitive-type="String|Array"><code>fields</code></h4>

A list of fields to attempt to update. All other fields will not be updated even if values are provided. If a string is passed, it will attempt to use [list-to-array](https://www.npmjs.com/package/list-to-array) to transform the string.

<h4 data-primitive-type="Boolean"><code>ignoreNoEdit</code></h4>

Allow the editing of fields specifically marked as `noEdit`. If `fields` is provided, this is defaulted to true, as only specifically selected fields will be updated.

<h4 data-primitive-type="Mixed"><code>required</code></h4>

A list of fields that must be included. Validation will fail and the data will not be updated if the field is not given in data. This can be a string that will be parsed using [list-to-array](https://www.npmjs.com/package/list-to-array), an array of field names, or an object with key: true for all fields that must be required.

<h4 data-primitive-type="Mongoose Object"><code>user</code></h4>

Allows passing in of a mongoose object of a keystone user. If the list has `tracking: true`, passing in a user will let `createdBy` or `updatedBy` to be set.
