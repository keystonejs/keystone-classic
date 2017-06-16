# Model

Once you retrieve a list from keystone, the [mongoose](http://mongoosejs.com/) methods can be accessed from.

Example:

```javascript
var User = require('keystone').List('User');

User.model.find({});
```

See the mongoose [query](http://mongoosejs.com/docs/queries.html) documentation for more details on querying your database.
