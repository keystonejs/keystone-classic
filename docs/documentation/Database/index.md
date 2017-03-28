# Database Configuration

## Concepts

Warn: KeystoneJS requires MongoDB v2.4 or greater.

In KeystoneJS, your data schema and models are controlled by **Lists**, and documents in your database are often called **Items**.

To define a data model, you create a `new keystone.List`, and pass it [list options](/documentation/database/#options).

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

```javascript
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
> The `author` field is a relationship with the `User` model, as seen in the [yo generator config](/getting-started/yo-generator).

## Drilldown Example

The drilldown option is a nice way to improve the usability of the Admin UI by providing context to the item a user is currently editing.

By default, the drilldown will just show the list that the item belongs to.

You can, however, set it to a `Relationship` field in the schema, and it will display the item currently stored in that relationship field.

If there would be several relationships that may be relevant to display in the drilldown list, you can separate their paths with spaces.

**Example: Including the author in the drilldown for Posts**

```javascript
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

```javascript
var keystone = require('keystone');

var BasePage = new keystone.List('BasePage', {
  map: { name: 'title' },
  autokey: { path: 'slug', from: 'title', unique: true },
});
BasePage.add({
  title: { type: String, required: true },
  slug: { type: String, readonly: true },
});
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

```javascript
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

```javascript
var keystone = require('keystone');
var Post = keystone.list('Post');

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

```javascript
var keystone = require('keystone');
var Post = keystone.list('Post');

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

To query data with pagination, you can use [List.paginate](/api/methods/paginate).

## Creating Items

To create new items, again use the [mongoose model](http://mongoosejs.com/docs/models.html):

**Creating Posts**

```javascript
var keystone = require('keystone')
var Post = keystone.list('Post');

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
> `newPost.slug == 'new-post';`

## Deleting Items

To delete items, first load the data, then use the `remove` method:

**Deleting a Post**

```javascript
var keystone = require('keystone')
var Post = keystone.list('Post');

Post.model.findById(postId)
  .remove(function(err) {
    // post has been deleted
  });
```

## Headings

Define headings to display within the flow of your documents. Headings can be defined as a `String` or `Object` and can [depend on](/documentation/database/#dependsOn) another field value for display.

```javascript
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

<h4 data-primitive-type="String"><code>heading</code></h4>

The text to display

<h4 data-primitive-type="Object"><code>dependsOn</code></h4>

The heading will only be displayed when the paths specified in the object match the current data for the item. [dependsOn](/field/options/#dependsOn)

## Fields

When adding `fields` to `Lists`, you can either specify basic data types or Keystone Field Types.

### Overview

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

### Field Options

For a full list of options that are available to all fields, see the [field options](/field/options) list.

### Underscore Methods

Some field types include helpful **underscore methods**, which are available on the item at the field's path preceded by an underscore.

**For example**: use the `format` underscore method of the `createdAt` `DateTime` field of the Posts List (above) like this

```javascript
var keystone = require('keystone');
var Post = keystone.list('Post');

Post.model.findById(postId).exec(function(err, post) {
  console.log(post._.createdAt.format('Do MMMM YYYY')); // 25th August 2013
});
```
