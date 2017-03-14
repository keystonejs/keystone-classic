---
title: Database Options
---

## Concepts

Warn: KeystoneJS requires MongoDB v2.4 or greater.

In KeystoneJS, your data schema and models are controlled by **Lists**, and documents in your database are often called **Items**.

To define a data model, you create a `new keystone.List`, and pass it [list options](/database/#options).

You then `add` fields to the list. Behind the scenes, a Keystone List will create a [mongoose schema](http://mongoosejs.com/docs/guide.html), and add the appropriate paths to it for the fields you define.

The `schema` is accessible, allowing you to plug in other mongoose functionality like virtuals, methods and pre / post hooks.

When you have finished setting up your List, call `list.register()` to initialise it and register it with Keystone.

To query your data, you use the `list.model` (which is a [mongoose model](http://mongoosejs.com/docs/models.html)).

List Items are [mongoose documents](http://mongoosejs.com/docs/documents.html). To create new items, use new `list.model()` and when you're ready to save it (or to save changes to an existing Item), call `item.save()`.

## Lists

### Usage

`new keystone.List(key:string [, options:object]);`

The syntax for creating a **Keystone List** is very similar to the syntax for creating a Mongoose Schema, with the exception of the constructor, which is `var MyList = new keystone.List(key, options)`.

Once you have created a new List, add fields to it using `MyList.add(fields:object)`, where fields is an object of keys (for field paths) and values (for field types, or options).

Fields are defined by an object with a `type` property, which must be a valid Field Type or basic data type. Using the object syntax you can specify additional options for the field. Common field options and field-type-specific options are detailed in the fields documentation.

When all the fields and options have been set on the list, call `MyList.register()` to register the list with Keystone and finalise its configuration.

The options can be found [here](/api/list/options)

### Example

A simple Post model for a blog might look like this:

**Post.js**
```
var keystone = require('keystone');
var Types = keystone.Field.Types;

var Post = new keystone.List('Post', {
    autokey: { path: 'slug', from: 'title', unique: true },
    map: { name: 'title' },
    defaultSort: '-createdAt'
});

Post.add({
    title: { type: String, required: true },
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft' },
    author: { type: Types.Relationship, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    publishedAt: Date,
    image: { type: Types.CloudinaryImage },
    content: {
        brief: { type: Types.Html, wysiwyg: true, height: 150 },
        extended: { type: Types.Html, wysiwyg: true, height: 400 }
    }
});

Post.defaultColumns = 'title, state|20%, author, publishedAt|15%'
Post.register();
```

> NOTE
> This example implements the optional `map`, `autokey` and `defaultSort` options, see the [api documentation](/api/list/options) for more details.

> NOTE
> It also specifies `title`, `state`, `author` and `publishedAt` as the default columns to display in the Admin UI, with state and publishedAt being given column widths.

> NOTE
> The `author` field is a relationship with the `User` model, as described in the [getting started guide](/guides/getting-started).

## Drilldown Example

The drilldown option is a nice way to improve the usability of the Admin UI by providing context to the item a user is currently editing.

By default, the drilldown will just show the list that the item belongs to.

You can, however, set it to a `Relationship` field in the schema, and it will display the item currently stored in that relationship field.

If there would be several relationships that may be relevant to display in the drilldown list, you can separate their paths with spaces.

**Example: Including the author in the drilldown for Posts**
```
var Post = new keystone.List('Post', {
    autokey: { path: 'slug', from: 'title', unique: true },
    map: { name: 'title' },
    defaultSort: '-createdAt',
    drilldown: 'author' // author is defined as a Relationship field in the example above
});
```

## Inheritance Example

The inheritance option can be used to allow a list to inherit its fields from another list using Mongoose [model discriminators](http://mongoosejs.com/docs/3.7.x/docs/api.html#model_Model.discriminator).

Parent lists may not themselves inherit from other lists.

**Example: Inheriting List fields from other lists**
```
var keystone = require('keystone');

var BasePage = new keystone.List('BasePage', {
   map: { name: 'title' },
	    autokey: { path: 'slug', from: 'title', unique: true },
	});
BasePage.add(
	{
		title: { type: String, required: true },
		slug: { type: String, readonly: true },
	}
);
BasePage.register();

var ChildPage = new keystone.List('ChildPage', { inherits: BasePage });
ChildPage.add({ child_content: { type: String, readonly: true } });
ChildPage.register();
```

## Schema Plugins

You can specify [virtuals, methods, statics](http://mongoosejs.com/docs/guide.html) as well as [pre and post hooks](http://mongoosejs.com/docs/middleware.html) for your **Lists** using the schema. You can also use [mongoose plugins](http://mongoosejs.com/docs/plugins.html) from the [plugins website](http://plugins.mongoosejs.com/).

For example, in our **Post** list above, we might want to automatically set the `publishedAt` value when the `state` is changed to `published` (but only if it hasn't already been set).

We might also want to add a method to check whether the post is published, rather than checking the `state` field value directly.

Before calling `Post.register()`, we would add the following code:
```
Post.schema.methods.isPublished = function() {
    return this.state == 'published';
}

Post.schema.pre('save', function(next) {
    if (this.isModified('state') && this.isPublished() && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});
```

## Querying Data

To query data, you can use any of the [mongoose query](http://mongoosejs.com/docs/queries.html) methods on the list.model.

**For example**: to load the last 5 `posts` with the state `published`, populating the linked `author`, sorted by reverse published date:

**Loading Posts**
```
var keystone = require('keystone'),
    Post = keystone.list('Post');

Post.model.find()
    .where('state', 'published')
    .populate('author')
    .sort('-publishedAt')
    .limit(5)
    .exec(function(err, posts) {
        // do something with posts
    });
```

### Promises

There exists another way to work with events in Javascript that is included in mongoose query methods. Instead of passing a [callback](http://javascriptissexy.com/understand-javascript-callback-functions-and-use-them/) to the [exec](http://mongoosejs.com/docs/api.html#query_Query-exec) method, we can use what it returns: a Promise. Promises are very useful for clean chaining of events with propagation of error.

For example: load `100` posts, then do something asynchronous, then do something with result:

**Loading Posts, doing something asynchronous, doing something**
```
var keystone = require('keystone'),
    Post = keystone.list('Post');

Post.model.find()
    .limit(100)
    .exec()
    .then(function (posts) { //first promise fulfilled
        //return another async promise
    }, function (err) { //first promise rejected
        throw err;
    }).then(function (result) { //second promise fulfilled
        //do something with final results
    }, function (err) { //something happened
        //catch the error, it can be thrown by any promise in the chain
        console.log(err);
    });
```

Pagination Querying

To query data with pagination, you can use `List.paginate()`, it returns a query object, just as `List.model.find()` would. It supports the options

- `page` - page to start at
- `perPage` - number of results to return per page
- `maxPages` - optional, causes the page calculation to omit pages from the beginning/middle/end(useful if you have lots of pages, and do not want them to wrap over several lines).

**For example**: to load the `posts` with the `maxPages` 10 and `perPage` 10,which state is `published`, populating the linked `author` and `categories`, sorted by reverse published date:

**Loading Posts with paginate**
```
var keystone = require('keystone'),
    Post = keystone.list('Post');

 Post.paginate({
		page: req.query.page || 1,
		perPage: 10,
		maxPages: 10
	})
	.where('state', 'published')
	.sort('-publishedDate')
	.populate('author categories')
	.exec(function(err, results) {
		locals.data.posts = results;
		next(err);
	});
```

When you call `exec` on a paginated query, it will return a lot of metadata along with the results:

- `total`: all matching results (not just on this page)
- `results`: array of results for this page
- `currentPage`: the index of the current page
- `totalPages`: the total number of pages
- `pages`: array of pages to display
- `previous`: index of the previous page, false if at the first page
- `next`: index of the next page, false if at the last page
- `first`: the index of the first result included
- `last`: index of the last result included

## Creating Items

To create new items, again use the [mongoose model](http://mongoosejs.com/docs/models.html):

**Creating Posts**
```
var keystone = require('keystone'),
    Post = keystone.list('Post');

var newPost = new Post.model({
    title: 'New Post'
});

if (shouldBePublished) {
    newPost.state = 'published';
}

newPost.save(function(err) {
    // post has been saved
});
```

> Automatic keys
> Because we set the `autokey` option on our `Post` list, it will have generated a unique key based on the `title` before it was saved to the database.
> ```newPost.slug == 'new-post';```

## Deleting Items

To delete items, first load the data, then use the `remove` method:

**Deleting a Post**
```
var keystone = require('keystone'),
    Post = keystone.list('Post');

Post.model.findById(postId)
    .remove(function(err) {
        // post has been deleted
    });
```

# Headings

Define headings to display within the flow of your documents. Headings can be defined as a `String` or `Object` and can [depend on](http://keystonejs.com/docs/database/#dependsOn) another field value for display.
```
Person.add(
	'User',
	{ name: { type: Types.Name, required: true, index: true, initial: true } },
	'Permissions',
	{ isAdmin: { type: Boolean, label: 'Can access Keystone', index: true } },
	// header object
	{ heading: 'Activities' },
	{ place: { type: Types.Select, options: ['GT', 'UGA'] } },
	// header with dependsOn
	{ heading: "GT Activities", dependsOn: { place: 'GT' } },
	{ type: { type: Types.Select, options: ['ZC', 'MP'], dependsOn: { place: 'GT'} }
);
```

**Options**
> `heading` String - the text to display
> `dependsOn` Object - heading will only be displayed when the paths specified in the object match the current data for the item. [dependsOn](http://keystonejs.com/docs/database/#dependsOn)

# Fields

When adding `fields` to `Lists`, you can either specify basic data types or Keystone Field Types.

## Overview

**Keystone Fields** allow you to easily add rich, functional fields to your application's models. They are designed to describe not just the structure of your data, but also the intention of your data. They provide:
- Rich controls in Keystone's Admin UI
- Complex data types; e.g. the `location` field stores several strings and an GeoJSON lng/lat point
- Formatting and validation methods
- Additional virtual properties; e.g. the `name` field provides a `name.full` virtual which concatenates the stored `name.first` and `name.last`
- Underscore methods; e.g. the `password` field provides a `password.compare` method for testing against the encrypted hash
- Metadata about how fields relate to each other; e.g. which fields depend on certain values in other fields
Basic data types are mapped to their corresponding Keystone field types:

Data type	  Field type
String	    Text
Number	    Number
Date	      DateTime
Boolean	    Boolean

## Field Options

All field types support several common options, which can specify database settings (such as `index` and `default`), or can provide information for Keystone's Admin UI (such as `label`).

> NOTE
> Fields can be nested inside objects, as in mongoose schemas.

> NOTE
> All [mongoose schema type options](http://mongoosejs.com/docs/schematypes.html) are passed to the [mongoose schema](http://mongoosejs.com/docs/guide.html), so you can also use any options mongoose supports.

Common field options include:

`label` String
: The label of each field is generated from the field path; set this option to override the default.

`required` Boolean
: Validates that the field has a value before an item can be saved (also passed to mongoose and enforced using a database index).

`initial` Boolean
: Causes the field to be displayed in the **Create Item** form, in the Admin UI.

`noedit` Boolean
: Renders the field as read-only in the admin UI.

`note` String
: Is displayed with the field in the admin UI.

`hidden` Boolean
: The field will always be hidden in the Admin UI if this is set to `true`

## Conditional Fields

To improve the usability of the Admin UI, it is possible to hide fields when no value is set, or depending on the value of other fields.

`collapse` Boolean
: Displays an **+ add** link in the admin UI when the field has no value. Will completely hide field UI when `noedit` is also set to true, when the field has no value

`dependsOn` Object
: The field or header will only be displayed when the paths specified in the object match the current data for the item.
You can target multiple values per path using an Array.
**Example**
```
first: { type: String },
// Will show if first === "value1", "1" or "2"
second: { type: String, dependsOn: { first: ['value1', '1', 2] } },
// Will show if first == "value1"
third: { type: String, dependsOn: { first: 'value1' } }
```

## Generated values and watching fields

Keystone's fields support a simple syntax for configuring dynamically updated fields. You can set a field to update its value whenever:

- The item is saved
- The value of any other field (or fields) changes
- The value of any other field (or fields) changes to a specific value

To use the watching functionaliy, set the following two options:

`watch` Boolean or String or Object or Function
: When `true`, the field value will be recalculated every time an item is saved.
Provide a space-delimited list of paths to recalculate the field value whenever one of those paths changes.
**For example**: `'author title state'`
Provide an object of key / value pairs to recalculate the field value whenever one of those paths changes to the value specified.
**For example**: `{'state': 'published', 'mainPost': true}`
Provide a function that returns true/false whenever you want.
**For example**: `function() { return this.author === this.editor; }`

`value` Function
: The function to generate the field value when a watched path is changed. Must return the new value, or accept a node-style `callback` argument, which can be called to set the field value asynchronously.
The `this` context of the function will be the item being saved.

**Example (synchronous)**
```
function () {
    return this.total<=this.totalreceived ? true:false;
}
```
**Example (asynchronous)**

```
function (callback) { // BEWARE: MUST be called "callback" to allow asynchronous execution
	list.model.findById(this.createdBy).exec(function(err, user){
		callback(err, user.name + "-" + Date.now());
	});
}
```

## Underscore Methods

Some field types include helpful **underscore methods**, which are available on the item at the field's path preceded by an underscore.

**For example**: use the `format` underscore method of the `createdAt` `DateTime` field of the Posts List (above) like this

```
var keystone = require('keystone'),
    Post = keystone.list('Post');

Post.model.findById(postId).exec(function(err, post) {
   console.log(post._.createdAt.format('Do MMMM YYYY')); // 25th August 2013
});
```

# Relationships

Keystone enhances MongoDB's ability to store the ObjectIDs of related documents in a field (or many related ObjectIDs in an Array) with support for Relationship fields and Definitions in Models.

## Relationship Fields

**`ObjectId` or `Array` — Displayed as an auto-suggest field in the Admin UI**

Stores references to ObjectIDs from another Model in an ObjectID field or array to create one-many or many-many relationships.

Specify the related Model using the `ref` option. For a many-many relationship, set the `many` option to `true`.

For example, if you wanted to link a **Post** model to a single **Author** and many **PostCategories**, you would do it like this:

```
Post.add({
    author: { type: Types.Relationship, ref: 'User' },
    categories: { type: Types.Relationship, ref: 'PostCategory', many: true }
});
```

### Relationship Filters

You can filter a relationship field using the `filters` option.

The `filters` option is an object of key/value pairs, in which the keys correspond to the fields of the related model to be filtered, and the values will either be literals or field names in the current model, the value of which will be used to filter the relationship.

In the example below, the `author` field will only allow selection of a `User` whose `group` field is equal to 'admin'.

```
Post.add({
    title: { type: String, required: true },
    category: { type: Types.Select, options: 'user, editor, admin', default: 'user' },
    author: { type: Types.Relationship, ref: 'User', filters: { group: 'admin' } }
});
```

You can also filter by the value of another field on the model. You do this setting the value of the filter to the name of the field, prefixed by a colon (:).

In the example below, the `author` field will only allow selection of a `User` whose `group` field is equal to the value of the `category` field of the `Post` model.

```
Post.add({
    title: { type: String, required: true },
    category: { type: Types.Select, options: 'user, editor, admin', default: 'user' },
    author: { type: Types.Relationship, ref: 'User', filters: { group: ':category' } }
});
```

Finally, you can also filter by the current model's `_id` field.

In the example below, the `bestPost` field will only allow selection of a `Post` whose `author` field is equal to the `_id` of the current document.

```
User.add({
    name: { type: String, required: true },
    group: { type: Types.Select, options: 'user, editor, admin', default: 'user' },
    bestPost: { type: Types.Relationship, ref: 'Post', filters: { author: ':_id' } }
});
```
> NOTE
> You can only set filters on one-many relationships (i.e. when the many option is NOT set to true).

### Populating related data in queries

You can populate related data for relationship fields thanks to [Mongoose's populate functionality](http://mongoosejs.com/docs/populate.html). To populate the author and category documents when loading a Post from the example above, you would do this:
```
Post.model.findOne().populate('author categories').exec(function(err, post) {
    // the author is a fully populated User document
    console.log(post.author.name);
});
```

> NOTE
> Note that if no ObjectId is stored, or an invalid ObjectId is stored (e.g. a document has been deleted), author will be undefined in the example above.

## Relationship Definitions

What if, in the example above, you wanted to see a list of the Posts by each Author? Because the relationship field is on the Post, you need to tell the Author (and the PostCategory) Model that it is being referred to. Doing so allows the Admin UI to represent the relationship from both sides.

You do this by calling the `relationship` method on the `Model` like this:
```
User.relationship({ path: 'posts', ref: 'Post', refPath: 'author' });
```

### Options

`path` String
: the path of the relationship reference on the Model

`ref` String
: the key of the referred Model (the one that has the relationship field)

`refPath` String
: the path of the relationship being referred to in the referred Model

As you can see, the options provided to the `relationship` method mirror those of the relationship field it refers to.

> NOTE
> Relationship definitions are optional; if you leave them out, the relationships simply won't be displayed in the Admin UI from the other side of the relationship. The relationship field will still work as expected.

## Loading related items

Filtering one-to-many related items is easy; simply specify the ID of the item you wish to filter on like any other value:

```
Post.model.find().where('author', author.id).exec(function(err, posts) {
    // ...
});
```
To filter many-to-many related items, use an `in` condition and specify one (or more) ids as an array:
```
Post.model.find().where('categories').in([category.id]).exec(function(err, posts) {
    // ...
});
```
