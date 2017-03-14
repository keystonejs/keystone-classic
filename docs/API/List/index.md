#List

List is the control point for constructing keystone's schema's, and related methods. It is used as a prototype in constructing new lists, before they are registered to keystone, which adds them to the schema.

`new keystone.List(key:string, options:object)` - a constructor that takes in a key for the name of a list, as well as options for the list.

See the [list options](../options) documentation for the full list of options.

For more on setting up a list see our [model guide](/guides/setting-up/database-setup).

A new list will be created with the following default options:

```JS
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

It will merge the defaultOptions with the passed options, deferring to the passed options when both define it. While fields can be set up in the constructor, the common pattern is to use [.add()](../add) on the instance of the list.

Once your list has been completed, you can need to call [.register()](../register).
