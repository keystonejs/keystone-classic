# Schema

The mongoose schema is accessible on new lists, and can be extended before the list is registered.

The most common uses of this are to add pre-save, and post-save hooks, add a schema method, or to add a virtual field. See the mongoose documentation for more information:  [mongoose schema docs](http://mongoosejs.com/docs/guide.html#options).

Example:

```javascript
User.schema.virtual('canAccessKeystone').get(function () {
  if (this.isAdmin) return true;
});
```
