##### add({ fields }, 'prefix')
Adds fields to a [keystone List](TK). Must be used before [register()](../register). This takes an object with all of the fields, as well as a prefix option TK- what does prefix do?.

Example call:

```
var Cat = new keystone.List('Cat');

Cat.add({
	name: { type: String },
	age: { type: Number },
});
```

Each field uses its key as the name of the field within the database.

All fields must have a type, either `String`, `Number`, `Boolean`, or one of the defined [keystone field types](/List/fields/types)

The list of options available to all fields can be found [here](TK)TK. For Keystone fields, each has its own options.

TK indents and heading and frigging indents what the heck?
