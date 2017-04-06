# Import

## `keystone.import(directoryName:String)`

Imports all javascript files in a directory, and returns the result as an object.  It uses the [module root](/documentation/configuration/project-options/#module-root) as the current directory for the directory chosen.The directory structure of the files is matched by the object structure.

Example:

We have a file structure in our `module root` of:

```sh
|-routes
|--api
|---route1.js
|---route2.js
|---route3.js
|--view
|---view1.js
|---view2.js
|-index.js
```

If in the `index.js` we call:

```javascript
var routes = keystone.import('routes');
```

We will be return an object that looks like:

```javascript
{
  api: {
    route1: /* contents */
    route2: /* contents */
    route3: /* contents */
  },
  view: {
    view1: /* contents */
    view2: /* contents */
  },
};
```

> NOTE: If a JS file in the directory does not have an export, the file will be run, but nothing will be returned.

> NOTE: import is synchronous. This can cause errors if any of the JS files being imported are asynchronous.
