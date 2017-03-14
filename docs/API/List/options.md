#### list construction options

The following is a list of all options for the keystone List [constructor](../), and their effects on the created list. Note that many of these can also be set using the [new List options](./)

## `label` `String`
 The label used for the list in the Admin UI. Defaults to a friendly form of `key`

## `path` `String`
 The path used for the list in the Admin UI. Defaults to a slugified form of `key`.

## `singular` `String`
 The singular label for the items in the list. Used in the Admin UI, defaults to a singular form of `label`.

## `plural` `String`
 The plural label for the items in the list. Used in the Admin UI, defaults to a plural form of `singular`

## `schema` `String`
Options for the Mongoose Schema for the List. Among other things, this option lets you specify a custom name for the collection. See the [mongoose schema docs](http://mongoosejs.com/docs/guide.html#options) for a list of available options.
*Warning: do not modify the `id` or `_id` schema options; the default behaviour is required by Keystone*

> NOTE
> If you're wondering how to control which navigation area Lists are categorised under in the Admin UI, check out the nav option in the KeystoneJS Configuration docs.

## `noedit` `boolean`

Disable the item from being edited in the admin UI or by [updateItem](/api/list/update-item) when true by mapping `noedit` to all fields on the list.

## `nocreate` `boolean`

Disable creation of new items in the admin UI. Items may still be created by the keystone server.

## `nodelete` `boolean`

Disable deleting items in the admin UI. Items may still be deleted by the keystone server.

## `hidden` `boolean`

If true, the list is hidden from the keystone admin UI.

## `track`

Sets up 4 fields that will be attached to the list; `createdAt`, `createdBy`, `updatedAt`, and `updatedBy`. `track` accepts a boolean value or an object. For a boolean `true`, all four fields are added. If an object is passed, any keys with value true for the fields will cause that field to be created.

* createdAt adds a pre-save hook, and is set to `new Date()` if the item is new.
* updatedAt adds a pre-save hook, and is set to `new Date()` if the item is new or modified.
* createdBy is a relationship field to your [user model](/configuration/#user-model), which will be automatically set by the admin UI if the item is new.
* udpatedBy is a relationship field to your [user model](/configuration/#user-model), which will be automatically set by the admin UI if the item is new or modified.

If you want to update `createdBy` and `updatedBy` on server side saves, you can use [updateItem](/api/update-item) to pass in a user.

Example:

```JS
Event.track = {
	createdAt: true,
	createdBy: true,
}
```

## `inherits`

You can make a list that inherits from another registered keystone list. This can add new fields to a schema, as well as adding a `__t` property to the schema with the value of the sublist name. In mongo, only one collection is created.

An example of inheritance would be:

```JS
var Post = new keystone.List('Post');

Post.add({
	name: { type: String, required: true },
	publishDate: { type: Types.DateTime },
});

Post.register();

var ReferencedArticle = new keystone.List('ReferencedArticle', { inherits: Post });

ReferencedArticle.add({ referenceList: Types.Textarray });
ReferencedArticle.register()
```

You can now make queries just against the `Article` collections, which will filter only articles, or against all Posts, which are stored in a single collection.

In the keystone admin UI, both the list and the sub-list will be visible.

Inheritance can only occur one level deep, so a list that inherits cannot also be inherited from.


## `drilldown` `String`

A space-delimited list of relationships to display as drilldown in the Admin UI

`sortContext` `String`
A `List:relationship` pair to control when drag and drop sorting is available in the Admin UI

## `perPage` `number`

Sets the number of items to be loaded per page on the keystone admin UI.

## `searchFields` `String`
A space-delimited list of paths to use for searching in Admin UI.

## `map` `Object`
An object that maps fields to special **list** paths. Each path defaults to its key if a field with that key is added. Mappable paths include
- name - the field that contains the name of the item, for display in the Admin UI.


## `autokey` `Object`
Adds a plugin to the list that automatically generates a key for each document when it is saved, based on the value of another field or path. The value of the option should be an object with the following keys:

- `from` String - the field or path to generate the key from, can be a space-delimited list of fields
- `path` String - the path to store the key at
- unique Boolean - whether the key should be unique or not
- `fixed` Boolean - the key should be kept if it exists and it's non-empty.

Defaults to `false`.
*Autokey paths are automatically indexed; you may also want to include them in compound indexes.*


## defaultColumns

Defines the default columns to be displayed in the keystone admin UI list view. If nothing is provided, default columns will be set to just the name field.

Set up default columns before registering the list.

Example:

```JS
Event.defaultColumns = 'name, displayName, email';
```

`defaultColumns` can be provided as a string of comma-separated values or as an array.

## `sortable` `boolean`

Provides a sort order for the list, and the ability to re-sort items in the admin UI by dragging and dropping them. This should not be used alongside `defaultSort`, as defaultSort will override the ability to see the sortOrder.

This adds a hidden field to the schema which is `sortOrder`, which is a number. Keystone updates the `sortOrder` whenever an item is dragged in the admin UI, changing all necessary items to correct the sortOrder.

## defaultSort

List option for what field to sort by in the admin UI. Defaults to the name field. Accepts a string.

You can reverse the sort order by adding a `-` symbol before the field name.

Example:

```JS
Event.defaultSort = '-createdAt'
```

This will sort by the `createdAt` field, with the earliest created items first.
