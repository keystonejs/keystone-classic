# query

`view.query(key:String, query:QueryObject[, options:Object])`

Attaches a database query to be run before the render occurs, during the `queryQueue` run. The data returned from the query will be attached to the `locals` with the value of the key.

Example:

```javascript
var User = keystone.list('User');

view.query('currentUser', User.model.findOne({ name: req.body.name }));
```

This query will add the user with a matching name to `locals.currentUser` for use by the template in rendering.
