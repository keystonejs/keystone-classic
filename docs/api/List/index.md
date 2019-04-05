# List

## `new keystone.List(key:String, options:Object)`

List is the control point for constructing Keystone's schema's, and related methods. It is used as a prototype in constructing new lists, before they are registered to Keystone, which adds them to the schema.

See the [list options](/api/list/options) documentation for the full list of options.

For more on setting up a list see our [model guide](/getting-started/setting-up/part-2).

A new list will be created with the following default options:

```javascript
{
  schema: {
    collection: keystone.prefixModel(key),
  },
  noedit: false,
  nocreate: false,
  nodelete: false,
  autocreate: false,
  sortable: false,
  hidden: false,
  track: false,
  inherits: false,
  perPage: 100,
  searchFields: '__name__',
  searchUsesTextIndex: false,
  defaultSort: '__default__',
  defaultColumns: '__name__',
};
```

It will merge the defaultOptions with the passed options, deferring to the passed options when both define it. While fields can be set up in the constructor, the common pattern is to use [.add()](/api/list/add) on the instance of the list.

Once your list has been completed, you need to call [.register()](/api/list/register).
