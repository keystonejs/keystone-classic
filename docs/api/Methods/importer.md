# Importer

## `keystone.importer(relativeDirName:String)`

Returns a function that imports all javascript files in a directory, using the passed in directory as the relative path from which to make the search.

Example:

```javascript
var importRoutes = keystone.importer(__dirname);

var routes = {
  views: importRoutes('./views'),
};

exports = module.exports = function (app) {
  app.get('/', routes.views.index)
};
```
