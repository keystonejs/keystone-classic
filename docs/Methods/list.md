# list

## `keystone.list(listName:String)`

A function used to retrieve a particular keystone list, so that items can be retrieved from the database, and saved to the database.

Example:

```javascript
var User = require('keystone').list('User');

User.model.find({}, callback)
```

> NOTE: keystone models use mongoose methods such as find undecorated.
