# Relationships

Keystone enhances MongoDB's ability to store the ObjectIDs of related documents in a field (or many related ObjectIDs in an Array) with support for Relationship fields and Definitions in Models.

### Relationship Fields

**`ObjectId` or `Array` — Displayed as an auto-suggest field in the Admin UI**

Stores references to ObjectIDs from another Model in an ObjectID field or array to create one-many or many-many relationships.

Specify the related Model using the `ref` option. For a many-many relationship, set the `many` option to `true`.

For example, if you wanted to link a **Post** model to a single **Author** and many **PostCategories**, you would do it like this:

```javascript
Post.add({
  author: { type: Types.Relationship, ref: 'User' },
  categories: { type: Types.Relationship, ref: 'PostCategory', many: true }
});
```

### Relationship Filters

You can filter a relationship field using the `filters` option.

The `filters` option is an object of key/value pairs, in which the keys correspond to the fields of the related model to be filtered, and the values will either be literals or field names in the current model, the value of which will be used to filter the relationship.

In the example below, the `author` field will only allow selection of a `User` whose `group` field is equal to 'admin'.

```javascript
Post.add({
  title: { type: String, required: true },
  category: { type: Types.Select, options: 'user, editor, admin', default: 'user' },
  author: { type: Types.Relationship, ref: 'User', filters: { group: 'admin' } }
});
```

You can also filter by the value of another field on the model. You do this setting the value of the filter to the name of the field, prefixed by a colon (:).

In the example below, the `author` field will only allow selection of a `User` whose `group` field is equal to the value of the `category` field of the `Post` model.

```javascript
Post.add({
  title: { type: String, required: true },
  category: { type: Types.Select, options: 'user, editor, admin', default: 'user' },
  author: { type: Types.Relationship, ref: 'User', filters: { group: ':category' } }
});
```

Finally, you can also filter by the current model's `_id` field.

In the example below, the `bestPost` field will only allow selection of a `Post` whose `author` field is equal to the `_id` of the current document.

```javascript
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

```javascript
Post.model.findOne().populate('author categories').exec(function(err, post) {
  // the author is a fully populated User document
  console.log(post.author.name);
});
```

> NOTE
> Note that if no ObjectId is stored, or an invalid ObjectId is stored (e.g. a document has been deleted), author will be undefined in the example above.

### Relationship Definitions

What if, in the example above, you wanted to see a list of the Posts by each Author? Because the relationship field is on the Post, you need to tell the Author (and the PostCategory) Model that it is being referred to. Doing so allows the Admin UI to represent the relationship from both sides.

You do this by calling the `relationship` method on the `Model` like this:

```javascript
User.relationship({ path: 'posts', ref: 'Post', refPath: 'author' });
```

### Options

<h4 data-primitive-type="String"><code>path</code></h4>

the path of the relationship reference on the Model

<h4 data-primitive-type="String"><code>ref</code></h4>

the key of the referred Model (the one that has the relationship field)

<h4 data-primitive-type="String"><code>refPath</code></h4>

the path of the relationship being referred to in the referred Model

As you can see, the options provided to the `relationship` method mirror those of the relationship field it refers to.

> NOTE
> Relationship definitions are optional; if you leave them out, the relationships simply won't be displayed in the Admin UI from the other side of the relationship. The relationship field will still work as expected.

### Loading related items

Filtering one-to-many related items is easy; simply specify the ID of the item you wish to filter on like any other value:

```javascript
Post.model.find().where('author', author.id).exec(function(err, posts) {
  // ...
});
```

To filter many-to-many related items, use an `in` condition and specify one (or more) ids as an array:

```javascript
Post.model.find().where('categories').in([category.id]).exec(function(err, posts) {
  // ...
});
```
