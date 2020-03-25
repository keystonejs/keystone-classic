# Part 3: Routing

Keystone is designed to streamline running an [ExpressJS](https://expressjs.com) application including configuration of common options.

In this tutorial section we are going to add *routing* to your Keystone application. Routing is the process of directing client requests (from web browsers or API calls) to corresponding handling functions in your application.

By the end of this tutorial section you will have created a basic web page rendered using the [Pug](https://pugjs.org) view engine. Pug is used as an example, but the principles of routing and rendering are the same for other view engines.

## Setup

From [Part 1: Initial Setup](/getting-started/setting-up/part-1) you should have the following files:

```sh
| MyProject
|--node_modules/
|--package.json
|--keystone.js
```

Keystone should already be installed and at a minimum your `keystone.js` file should include the following:

```javascript
var keystone = require('keystone');

keystone.init({
  'cookie secret': 'secure string goes here',
});

keystone.start();
```

If you completed [Part 2: Data Model Setup](/getting-started/setting-up/part-2) your `keystone.js` will have additional database configuration options. The database configuration options aren't required for the basic routing and web page set up in this tutorial section, but you'll need to keep those details for the subsequent tutorial section ([Part 4: Adding data from a form](/getting-started/setting-up/part-4)).

## Adding a new page view

### Modifying the `keystone.js` file

As mentioned in Part 1, `keystone.init` defines initial options for Keystone's startup. For rendering application views we are going to add two new properties to  `keystone.init`, and then add a line that will import our routes.

The two properties to add are:
 1. `views`: A folder location relative to `keystone.js` to load view files from. We're going to use `'templates/views'`.
 2. `view engine`: A template engine for Keystone to use to render view files. This will be `pug`.

Your `keystone.init` should now have at least the following properties:

```javascript
keystone.init({
  'cookie secret': 'secure string goes here',
  views: 'templates/views',
  'view engine': 'pug',
});
```

Keystone will look for an installed `npm` package with the same name as the view engine, so you are going to have to install `pug` to get this working.

```sh
$ npm install --save pug
```

Finally, add a line to tell Keystone where you plan to define your routes:

```javascript
keystone.set('routes', require('./routes'));
```

### Adding routes

Next, we need to add `routes` files. We are going to construct them using Keystone's recommended file and directory layout, however you can structure  differently if you prefer.

First we are going to add a `routes` folder, and make an `index.js` file in it. Within the `routes` folder, add a `views` folder and then give that its own `index.js`.

After this you should have a folder structure that looks like:

```sh
| MyProject
|--node_modules/
|--routes
|	|--index.js
|	|--views
|	|	|--index.js
|--keystone.js
```

The reason for this structure is that it is best to keep the individual routes in their own files, and use a single central file to collect them.

#### `routes/index.js`

Let's start with the central routing file, `routes/index.js`.

This file is going to export a function, take in the Express app Keystone has built for us, and add on our individual routes.

The most basic form would look like:

```javascript
function routeFunction(req, res) {
  res.render('index');
}

module.exports = function (app) {
  app.get('/', routeFunction);
};
```

For each route we want, we add a new path and route function. In the example above, the path `'/'` (the default homepage) will be handled by `routeFunction()`.

What we are going to add will be slightly more complicated:

```javascript
var keystone = require('keystone');
var importRoutes = keystone.importer(__dirname);

var routes = {
  views: importRoutes('./views'),
};

exports = module.exports = function (app) {
  app.get('/', routes.views.index)
};
```

The Keystone importer gives us a function that allows us to reduce a folder and its contents to an object with the same nesting.

We then call `importRoutes` with the directory we want to import, and attach it to an object at `routes.views`. Finally, we can now provide `routes.views.index` as the second argument for our `app.get` function call.

This is a bit heavyweight for a single route, but makes it easy to add new routes, without requiring a litany of requirements of every file as you go along. We're going to need some content in `routes/views/index.js` for this to run now.

#### `routes/views/index.js`

This is our first endpoint file, and is an important point for a lot of common patterns in setting up new routes.

Let us jump right in to the code for this one:

```javascript
module.exports = function (req, res) {
    res.send('Hello you learner, you');
};
```

This is using Express routing, which you can learn more about in the Express documentation: [Basic routing](http://expressjs.com/en/starter/basic-routing.html).

What we are going to want in this instance is to render our first view. For that, we want our file to read:

```javascript
module.exports = function (req, res) {
  res.render('index');
};
```

### Adding a view

The final step to having a view rendered is the view file itself, which includes   templated text contents.

First you will need a new templates folder at the top level, and a `views` folder within that. In this `views` folder create a file `index.pug`. After this, your file structure should look like:

```sh
| MyProject
|--node_modules/
|--routes
|	|--index.js
|	|--views
|	|	|--index.js
|--templates
|	|--views
|	|	|--index.pug
|--keystone.js
```

Note that the routes/views and templates/views are mirroring each other. It is a good idea to follow this pattern as you add more routes so the relationship between them is easy to determine.

The `index.pug` file just needs a bit of content:

```jade
doctype html
html(lang="en")
  head
    title= "Words on a page"
  body
    h1 Welcome to Keystone!
    #container.col
      p.
          Hope you're enjoying learning about KeystoneJS. We're close to some very dynamic cool things.
```

Now, if you start your Keystone app using `node keystone` you should be able to visit the homepage and see it rendered!

## Next Steps

Continue this tutorial with [Part 4: Adding data from a form](/getting-started/setting-up/part-4), which walks you through setting up an API endpoint to save data from a form to a database.

## Learn more about:

- [keystone.set](/api/methods/set)
- [init options](/documentation/configuration)
- [keystone.importer](/api/methods/importer)
- [Express](https://expressjs.com)
- [Pug](https://pugjs.org)
