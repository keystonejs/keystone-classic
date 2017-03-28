# Create Items

## `keystone.createItems(data:Object[, options:Object, callback:Function])`

Keystone's `createItems` function is a simple but powerful way to populate your database with data.

It can be used to create [test fixtures](http://en.wikipedia.org/wiki/Test_fixture) or initialise your database with default content / users / etc.

There's also a shorthand syntax that can be used within update files; if you are using the [auto updates](/documentation/application-updates) feature, any file that exports a `data` object will automatically be wrapped and the data will be created.

`createItems` takes two passes at the data it is passed, first creating the items and retaining references by key (if provided) that can be used to populate relationships in the second pass. This makes it easy to create related data without asynchronous nesting (which for data creation sometimes ends up in knots).

The `data` argument should be an `Object` containing an `Array` for each `List` you want to populate. Each object in the array contains the data for a single item.

Each data property should match to a field path (or sub-field path) - all paths recognised by the [UpdateHandler](/api/methods/update-handler) are usable.

A special property, `__ref`, can be set with a string value that is used to reference the item in relationships.

Relationship fields should contain either a string matching another item's `__ref` property, or (for `many: true` relationship fields) can contain an array of strings.

The `options` object can be used to set createItems to be `verbose` (defaults to false), or the data checking to not be `string` (defaults to true).

The `callback(err, stats)` function is passed the error (if there was one) and a stats object containing counts for each list of items that were created, and a special `message` property that can be parsed as Markdown or logged to the console.

See below for two usage examples, both independently and as an update script.

Example

```javascript
keystone.createItems({
  User: [
    { name: 'Joe', email: 'some@valid.string' },
    { name: 'Jo', email: 'more@valid.string' },
  ],
  Post: [
    { title: 'First!', content: variablePreparedEarlier },
    { title: 'Nice first post', content: variablePreparedEarlier2 },
    { title: 'Second ;)', content: variablePreparedEarlier3 },
  ],
  Coffee: [{ type: 'cap', size: 'L' }],
}, { verbose: true}, function (err, stats) {
  if (err) throw new Error('panic!', err);
  console.log('our results', stats);
})
```
