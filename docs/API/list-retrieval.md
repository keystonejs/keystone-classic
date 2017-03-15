# list

## `keystone.list(listName:string)`

A function used to retrieve a particular keystone list, so that items can be retrieved from the database, and saved to the database.

Example:

```JS
var User = require('keystone').list('User');

User.model.find({}, callback)
```

> NOTE: keystone models use mongoose methods such as find undecorated.
