# Field Options

There are some options that are available to every field. These are:

All field types support several common options, which can specify database settings (such as `index` and `default`), or can provide information for Keystone's Admin UI (such as `label`).

> NOTE
> Fields can be nested inside objects, as in mongoose schemas.

> NOTE
> All [mongoose schema type options](http://mongoosejs.com/docs/schematypes.html) are passed to the [mongoose schema](http://mongoosejs.com/docs/guide.html), so you can also use any options mongoose supports.

Common field options include:

<h4 data-primitive-type="String"><code>label</code></h4>

The label of each field is generated from the field path; set this option to override the default.

<h4 data-primitive-type="Boolean"><code>required</code></h4>

Validates that the field has a value before an item can be saved (also passed to mongoose and enforced using a database index).

<h4 data-primitive-type="Boolean"><code>initial</code></h4>

Causes the field to be displayed in the **Create Item** form, in the Admin UI.

<h4 data-primitive-type="Boolean"><code>noedit</code></h4>

Renders the field as read-only in the admin UI.

<h4 data-primitive-type="String"><code>note</code></h4>

Is displayed with the field in the admin UI.

<h4 data-primitive-type="Boolean"><code>hidden</code></h4>

The field will always be hidden in the Admin UI if this is set to `true`

### Conditional Fields

To improve the usability of the Admin UI, it is possible to hide fields when no value is set, or depending on the value of other fields.

<h4 data-primitive-type="Boolean"><code>collapse</code></h4>

Displays an **+ add** link in the admin UI when the field has no value. Will completely hide field UI when `noedit` is also set to true, when the field has no value

<h4 data-primitive-type="Object|Array"><code>dependsOn</code></h4>

The field or header will only be displayed when the paths specified in the object match the current data for the item. You can target multiple values per path using an Array. The contents of dependsOn are passed to [expression match](http://npmjs.com/package/expression-match), if you want to form more complex queries.

**Example**

```javascript
first: { type: String },
// Will show if first === "value1", "1" or "2"
second: { type: String, dependsOn: { first: ['value1', '1', 2] } },
// Will show if first == "value1"
third: { type: String, dependsOn: { first: 'value1' } }
```

### Generated values and watching fields

Keystone's fields support a simple syntax for configuring dynamically updated fields. You can set a field to update its value whenever:

- The item is saved
- The value of any other field (or fields) changes
- The value of any other field (or fields) changes to a specific value

To use the watching functionality, set the following two options:

<h4 data-primitive-type="Mixed"><code>watch</code></h4>

When `true`, the field value will be recalculated every time an item is saved.

Provide a space-delimited list of paths to recalculate the field value whenever one of those paths changes.

**For example**:

`'author title state'`

Provide an object of key / value pairs to recalculate the field value whenever one of those paths changes to the value specified.

**For example**:

`{'state': 'published', 'mainPost': true}`

Provide a function that returns true/false whenever you want.

**For example**:

`function() { return this.author === this.editor; }`

<h4 data-primitive-type="Function"><code>value</code></h4>

The function to generate the field value when a watched path is changed. Must return the new value, or accept a node-style `callback` argument, which can be called to set the field value asynchronously.
The `this` context of the function will be the item being saved.

**Example (synchronous)**

```javascript
function () {
  return this.total<=this.totalreceived ? true:false;
}
```

**Example (asynchronous)**

```javascript
function (callback) { // BEWARE: MUST be called "callback" to allow asynchronous execution
  list.model.findById(this.createdBy).exec(function(err, user){
    callback(err, user.name + "-" + Date.now());
  });
}
```
