#### list construction options

The following is a list of all options for the keystone List [constructor](../), and their effects on the created list. Note that many of these can also be set using the [new List options](TK)TK

TK incomplete

## `noedit` `boolean`

disable the item from being edited in the admin UI or by [updateItem](updateItem)TK when true by mapping `noedit` to all fields on the list.

## `nocreate` `boolean`

disable creation of new items in the admin UI. Items may still be created by the keystone server.

## `nodelete` `boolean`

disable deleting items in the admin UI. Items may still be deleted by the keystone server.

## `hidden` `boolean`

if true, the list is hidden from the keystone admin UI.

## `track`

Sets up 4 fields that will be attached to the list; `createdAt`, `createdBy`, `updatedAt`, and `updatedBy`. `track` accepts a boolean value or an object. For a boolean `true`, all four fields are added. If an object is passed, any keys with value true for the fields will cause that field to be created.

* createdAt adds a pre-save hook, and is set to `new Date()` if the item is new.
* updatedAt adds a pre-save hook, and is set to `new Date()` if the item is new or modified.
* createdBy is a relationship field to your [user model](TK)TK, which will be automatically set by the admin UI if the item is new.
* udpatedBy is a relationship field to your [user model](TK)TK, which will be automatically set by the admin UI if the item is new or modified.

If you want to update `createdBy` and `updatedBy` on server side saves, you can use [updateItem](TK)TK to pass in a user.

Example:

```JS
Event.track = {
	createdAt: true,
	createdBy: true,
}
```

## `inherits`

Used when you want a single mongo collection, but want it to be displayed as multiple subsections in the admin UI. Must be passed a registered keystone list. In the database, fields added to the inheriting list will be saved to a single collection with the property `__t` set to the name of their secondary collection.

In the admin UI, all items will be displayed twice, in both views of the parent list, and the inheriting list. In the parent list view of an item, only the parent list's fields will be visible. In the inheriting list view of an item, parent list and child list fields are both visible.

Keystone only allows inheritance down one level.

## `perPage` `number`

Sets the number of items to be loaded per page on the keystone admin UI.

## `searchFields` String TK - expand, detail
A space-delimited list of paths to use for searching in Admin UI.

`searchUsesTextIndex` TK

## defaultColumns

Defines the default columns to be displayed in the keystone admin UI list view. If nothing is provided, default columns will be set to just the [map](TK)TK field.

Set up default columns before registering the list.

Example:

```JS
Event.defaultColumns = 'name, displayName, email';
```

`defaultColumns` can be provided as a string of comma-separated values or as an array.

## `sortable` `boolean`

Provides a sort order for the list, and the ability to re-sort items in the admin UI by dragging and dropping them. This should not be used alongside `defaultSort`, as defaultSort will override the ability to see the sortOrder.

This adds a new field to the schema which is `sortOrder`, which is a number. Keystone updates the `sortOrder` whenever an item is dragged in the admin UI, changing all necessary items to correct the sortOrder.

## defaultSort

List option for what field to sort by in the admin UI. Defaults to the name field. Accepts a string.

You can reverse the sort order by adding a `-` symbol before the field name.

Example:

```JS
Event.defaultSort = '-createdAt'
```

This will sort by the `createdAt` field, with the earliest created items first.
