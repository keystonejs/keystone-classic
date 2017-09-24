# Add

## add(fields:Object, prefix:String)

Adds fields to a [keystone List](/api/list/options). Must be used before [register()](/api/list/register). This takes an object with all of the fields, as well as a prefix option. The prefix will be added to the list's collection name in mongo.

Example call:

```javascript
var Cat = new keystone.List('Cat');

Cat.add({
  name: { type: String },
  age: { type: Number },
});
```

Each field uses its key as the name of the field within the database.

All fields must have a type, either `String`, `Number`, `Boolean`, or one of the defined [keystone field types](/api/field)
