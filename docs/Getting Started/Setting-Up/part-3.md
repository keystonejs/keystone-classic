# Part 3: Routing

Keystone is designed to do much of the setup of running an [express](expressjs.com) application out of your hands as well as allowing an easy configuration of the options.

Here we are going to add a router to our keystone application, and set up a basic webpage. This will not rely on what was done in part 2.

After that, we are going to set up an API endpoint to retrieve information about the events model, which will be relying on setup we did in [Part 2](/getting-started/setting-up/part-2).

For our routing, we are going to be using [pug](pugjs.org) to render our views, however the principles will remain the same for other view engines.

## Setup

From [part 1](/getting-started/setting-up/part-1), we should have the following files:

```sh
| our Project folder
|--node_modules/
|--package.json
|--keystone.js
```

We should have installed keystone. We need at least the following in our `keystone.js` folder:

```javascript
var keystone = require('keystone');

keystone.init({
  'cookie secret': 'secure string goes here',
});

keystone.start();
```

If you did [part 2](/getting-started/setting-up/part-2), you will have more than this, however we will leave off that until we get to looking at our api route.

## Adding a new page view

### Modifying our `keystone.js` file

As we mentioned in part one, keystone.init allows us to define our initial options for keystone's startup. For configuring our database connection, we are going to add 2 new properties to our `keystone.init`, and then add a line that will import our routes.

Our two properties are `views` and `view engine`. The first allows us to set a folder location relative to `keystone.js` to load our view files from. The second sets an engine for keystone to try and render the files with.

We are going to want to set them as:

```javascript
  views: 'templates/views',
  'view engine': 'pug',
```

which will give us an init looking something like:

```javascript
keystone.init({
  'cookie secret': 'secure string goes here',
  views: 'templates/views',
  'view engine': 'pug',
});
```

Keystone will look for an installed npm package with the same name as the view engine, so we are going to have to install `pug` to get this working.

```sh
$ npm install --save pug
```

Finally, we need to add a line to tell keystone where we plan to write our routes.

```javascript
keystone.set('routes', require('./routes'));
```

### Adding our routes file

Next, we need to add our `routes` files. We are going to construct them along keystone's [recommended file format](), however you can structure them differently.

First we are going to add a routes folder, and make an `index.js` file in it. Within our `routes` folder, add a `views` folder and then give that its own `index.js`. After this we should have a folder structure that looks like:

```sh
| Our Project
|--node_modules/
|--routes
|	|--index.js
|	|--views
|	|	|--index.js
|--keystone.js
```

The reason for this structure is that it is best to keep the individual routes in their own files, and use a single central file to collect them.

#### `routes/index.js`

Let's fill out our central file, our `routes/index.js`.

This file is going to export a function, takes in the express app keystone has built for us, and adds on our individual routes.

The most basic form of it would look like:

```javascript
exports = module.exports = function (app) {
  app.get('/', routeFunction);
};
```

For each route we want, we add a new item. Each takes in its own function that it runs when a particular endpoint is hit, in this case `'/'`, the homepage.

What we are going to add is going to be slightly more complicated.

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

The keystone importer gives us a function that allows us to reduce a folder and its contents to an object with the same nesting.

We then call `importRoutes` with the directory we want to import, and attach it to an object at `routes.views`. Finally, we can now provide `routes.views.index` as the second argument for our `app.get` function call.

This is a bit heavyweight for a single route, but makes it easy to add new routes, without requiring a litany of requirements of every file as you go along. We're going to need some content in `routes/views/index/js` for this to run now.

#### `routes/views/index.js`

This is our first endpoint file, and is an important point for a lot of common patterns in setting up new routes. Let us jump right in to the code for this one.

```javascript
module.exports = function (req, res) {
    res.send('Hello you learner, you');
};
```

This is using express routing, which you can find out more about [at their website](http://expressjs.com/en/starter/basic-routing.html).

What we are going to want in this instance is to render our first view. For that, we want our file to read:

```javascript
module.exports = function (req, res) {
  res.render('index');
};
```

### Adding our view

Our final step to having a view rendered is the view file itself, which we can use to write the text to be rendered.

First we will need a new templates folder at the top level, and a views folder within that. In this views folder create a file `index.pug`. After this, our file structure should look like:

```sh
| Our Project
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

Note that the routes/views and templates/views are mirroring each other. It is a good idea to keep this as you add more routes, so the relationship between them is easy to determine.

Our pug folder just needs a bit of content:

```jade
doctype html
html(lang="en")
  head
    title= "Words on a page"
  body
    h1 Welcome to Keystone!
    #container.col
      p.
          Hope you're enjoying learning about keystone. We're close to some very dynamic cool things
```

Check out [pugjs.org](pugjs.org) if you want to know more about pug.

Now, if we start our keystone app using `node keystone`, we should be able to visit the homepage and see it rendered!

[Part 4](/getting-started/setting-up/part-4)

## Next Steps

Learn more about:

- [keystone.set](/methods/set)
- [init options](/configuration)
- [pug](pugjs.org)
- [express](expressjs.com)
- [keystone.importer](/methods/importer)
