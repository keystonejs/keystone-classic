# Quick Start: Yeoman Generator

The easiest way to get started is to use our Keystone Yeoman Generator. [Yeoman](http://yeoman.io) is a scaffolding tool that helps you kickstart new projects using plugins called generators. The [Keystone Yeoman Generator](https://github.com/keystonejs/generator-keystone) includes prompts to create a new Keystone app based on a few questions such as template formats (Pug, Nunjucks, Twig, or HBS), CSS pre-processor (LESS, Sass, or Stylus), and site features (blog, image gallery, and contact form). The intent is to demonstrate some of the flexibility of Keystone including example code & templates (with optional comments) that you can use as the basis for a new application.

The rest of this guide will walk you through what the generator has created for you, however this should also give you the context to [start a project from scratch](/getting-started/setting-up/part-1) if you do not wish to use the generator for future projects.

To use the generator, you need to install [Yeoman](http://yeoman.io) (`yo`):

```sh
$ npm install -g yo
```
Once you have `yo`, you will then need to install the Keystone generator:

```sh
$ npm install -g generator-keystone
```

## yo keystone

Run `yo keystone` to create a new project. The generator will ask you questions about your project setup and then generate the base files for you before doing an `npm install`.

Running `yo keystone` will create most of the parts described below, depending on the options you select. You can also create a starter project using all default options (with no prompting) using `yo keystone auto`.

If you want more information about the generator, see the [Keystone Yeoman Generator](https://github.com/keystonejs/generator-keystone) project.

In the guide we'll be using the default options of [Pug](https://pugjs.org) for our view templates and [LESS](http://lesscss.org) for our CSS templates. In your own project you can use any template language you like; see [using other template languages](#using-other-template-languages) (below) for more information.


## Our Setup:

### keystone.js start script

The first place to look is the `keystone.js` file. This is the script that will run your Keystone website, and is the file used to set most of the Keystone configuration options.

```javascript
var keystone = require('keystone');
keystone.init({

  'name': 'My Project',

  'less': 'public',
  'static': 'public',

  'views': 'templates/views',
  'view engine': 'pug',

  'auto update': true,
  'mongo': 'mongodb://localhost/my-project',

  'session': true,
  'auth': true,
  'user model': 'User',
  'cookie secret': '(your secret here)'

});

keystone.import('models');

keystone.set('routes', require('./routes'));

keystone.start();
```

> For more information about the options Keystone supports, see the [configuration](/documentation/configuration/) guide.

## Project Structure

The Keystone generator creates a recommended project structure designed to make it easy to begin development.

Below is the folder structure laid out with explanations of the expected contents:

```sh
|--lib
|  Custom libraries and other code
|--models
|  Your application's database models
|--public
|  Static files (css, js, images, etc.) that are publicly available
|--routes
|  |--api
|  |  Your application's api controllers
|  |--views
|  |  Your application's view controllers
|  |--index.js
|  |  Initialises your application's routes and views
|  |--middleware.js
|  |  Custom middleware for your routes
|--templates
|  |--includes
|  |  Common .pug includes go in here
|  |--layouts
|  |  Base .pug layouts go in here
|  |--mixins
|  |  Common .pug mixins go in here
|  |--views
|  |  Your application's view templates
|--updates
|  Data population and migration scripts
|--package.json
|  Project configuration for npm
|--keystone.js
|  Main script that starts your application
```

Your application will be simpler to build and maintain if you mirror the internal structure of your `routes/views` and `templates/views` directories as much as possible.

> NOTE: This guide assumes you follow the recommendations above. However, Keystone doesn't actually enforce any structure so you're free to make changes to better suit your application or preferences.

## Models

Before you can start your Keystone app, you'll need some data models.

We're going to start with the `User` model, which is special -- this is required for Keystone's authentication and session management.

**models/users.js**

This script initialises the `User` model. It doesn't need to export anything, but the model *must* be registered with Keystone.

```javascript
var keystone = require('keystone');
var Types = keystone.Field.Types;

var User = new keystone.List('User');

User.add({
  name: { type: Types.Name, required: true, index: true },
  email: { type: Types.Email, initial: true, required: true, index: true },
  password: { type: Types.Password, initial: true },
  canAccessKeystone: { type: Boolean, initial: true }
});

User.register();
```

## Authentication and Session Management

For Keystone to provide authentication and session management to your application, it needs to know a few things:

- The option `user model` must be the name of the Model that Keystone should look in to find your users. If you use a different model name, be sure to set this option correctly.
- If you want your application to support session management, set the `session` option to `true`. Loading sessions incurs a small overhead, so if your application doesn't need sessions you can turn this off.
- Keystone has built-in views for signing in and out. To enable them, set the `auth` option to `true`. You can also implement custom signin and signout screens in your applications' views.
- Sessions are persisted using an encrypted cookie storing the user's ID. Make sure you set the `cookie secret` option to a long, random string.
- The user model must have a `canAccessKeystone` property that says whether a user can access Keystone's Admin UI or not. This property can be a virtual method or a stored boolean. **Note:** If you choose to use a virtual method, setting the value in MongoDB directly will not authenticate correctly. A virtual method is useful when the criteria for access is more complex. See [Mongoose virtuals](http://mongoosejs.com/docs/4.x/docs/guide.html#virtuals).

### More on Data Models

For more information on how to set up your application's models and the full documentation for lists and fields, see [Database Configuration](/documentation/database/).

## Routes & Views

The easiest and clearest way to configure the logic for different routes (or views) in your application is usually to set up all the bindings in a single file, then put any common logic (or middleware) in another file.

Then, the controller for each route you bind goes in its own file and can be organised similarly to the template that renders the view.

Keystone's [importer](/api/methods/importer) and Express's middleware support makes this easy to set up.

### Routes and Middleware

**routes/index.js**

This script imports your route controllers and binds them to URLs:

```javascript
var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Handle 404 errors
keystone.set('404', function(req, res, next) {
  res.notfound();
});

// Handle other errors
keystone.set('500', function(err, req, res, next) {
  var title, message;
  if (err instanceof Error) {
    message = err.message;
    err = err.stack;
  }
  res.err(err, title, message);
});

// Load Routes
var routes = {
  views: importRoutes('./views')
};

// Bind Routes
exports = module.exports = function(app) {

  app.get('/', routes.views.index);

}
```

#### Stepping through the route controller index

- Load `keystone`, the `middleware.js` file (below), and create an `importer` for the current directory
- Bind middleware (below) that
  - Initialises our basic error handlers
  - Initialises common local variables for our view templates
  - Retrieves flash messages from session before the view template is rendered
- Tell Keystone how to handle `404` and `500` errors
- Use the importer to load all the route controllers in the `/routes/views` directory
- Export a method that binds the index route controller to `GET` requests on the root url `/`
  - The `app` argument to this method comes from our Express app, so anything you can do binding routes in Express, you can do here.
- Additional route controllers that you add to your app should be added using `app.get`, `app.post` or `app.all` under your root controller.

### Common Route Middleware

Putting your common middleware in a separate `routes/middleware.js` file keeps your route index nice and clean. If your middleware file gets too big, it's a good idea to restructure any significant functionality into custom modules in your projects `/lib` folder.

**routes/middleware.js**

This script includes common middleware for your application routes:

```javascript
var _ = require('lodash');

/**
  Initialises the standard view locals.
  Include anything that should be initialised before route controllers are executed.
*/
exports.initLocals = function(req, res, next) {

  var locals = res.locals;

  locals.user = req.user;

  // Add your own local variables here

  next();

};

/**
    Inits the error handler functions into `res`
*/
exports.initErrorHandlers = function(req, res, next) {

  res.err = function(err, title, message) {
    res.status(500).render('errors/500', {
      err: err,
      errorTitle: title,
      errorMsg: message
    });
  }

  res.notfound = function(title, message) {
    res.status(404).render('errors/404', {
      errorTitle: title,
      errorMsg: message
    });
  }

  next();

};

/**
  Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function(req, res, next) {

  var flashMessages = {
    info: req.flash('info'),
    success: req.flash('success'),
    warning: req.flash('warning'),
    error: req.flash('error')
  };

  res.locals.messages = _.some(flashMessages, function(msgs) { return msgs.length }) ? flashMessages : false;

  next();

};
```

#### Middleware functions

Keystone expects middleware functions to accept the following arguments:

- req - an Express request object
- res - an Express response object
- next - the method to call when the middleware has finished running (including any internal callbacks)

#### Flash message support (no, not that flash)

Keystone includes support for 'flashing' messages to your visitors via session. The default setup above supports four categories, all of which can be styled differently:

- info
- success
- warning
- error

You can easily support other types of messages by updating your middleware and the .pug template that renders them (which we'll get to below).

To use flash messages in your route controllers, do this:

`req.flash('info', 'Some information!');`

Messages use sessions so they survive redirects and will only be displayed to the user once, making them perfect for status messages (e.g. "Your changes have been saved") or form validation (e.g. "Please enter a valid email address").

Some Keystone features (such as the [Update Handler](/api/methods/update-handler/)) can automatically generate flash messages for you and expect the categories above to be available.

## Templates

Now, for the template our route will `render`. The render method looks in the `views` directory specified in `keystone.js`, which we set to `/templates/views`.

The generator has several options, however we are going to use Pug. To learn more about Pug, visit [pugjs.org](https://pugjs.org).

Pug comes with some great features to simplify templates - including using layouts that define regions. We're going to use a layout called `../templates/layouts/base.pug`, which is included on the first line of the file above:

**templates/layouts/base.pug**

The base layout for our view templates:

```jade
include ../mixins/flash-messages

doctype html
html
  head
    meta(charset="utf-8")
    meta(name="viewport", content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width")

    title= title || 'My Keystone Website'
    link(href="/styles/site.min.css", rel="stylesheet")

    block css
    block head
  body

    #header My Keystone Website

    #body

      block intro

      +flash-messages(messages)

      block content

    #footer Powered by <a href='http://v4.keystonejs.com', target='_blank'>KeystoneJS</a>.

  block js
```

We also have a mixin file `templates/mixins/flash-messages.pug` which we can add to include the `flash-messages`. Including mixins in your layout or view templates is a great way to keep your layout and view files clean, and re-use mixins across multiple views.

**templates/mixins/flash-messages.pug**

Our flash-messages mixin:

```jade
mixin flash-messages(messages)
  if messages
    #flash-messages.container
      each message in messages.info
        +flash-message(message, 'info')
      each message in messages.success
        +flash-message(message, 'success')
      each message in messages.warning
        +flash-message(message, 'warning')
      each message in messages.error
        +flash-message(message, 'danger')

mixin flash-message(message, type)
  div(class='alert alert-' + type)
    if utils.isObject(message)
      if message.title
        h4= message.title
      if message.detail
        p= message.detail
      if message.list
        ul
          each item in message.list
            li= item
    else
      = message
```

### Using other template languages

KeystoneJS supports any [template language supported by Express](https://expressjs.com/en/api.html).

Use the `view engine` option to specify the template language you want to use.

If you want to use a custom template engine, set the `custom engine` option as well. For instance, [EJS](http://ejs.co) is supported by Express by default, but you might want to use [ejs.locals](https://github.com/RandomEtc/ejs-locals) as a template engine in order to benefit from get extensions.

```javascript
// Modified web.js to use the ejs-locals custom template engine.
var keystone = require('keystone');
var engine   = require('ejs-locals');
keystone.init({
  ...
  'custom engine': engine,
  'view engine': 'ejs',
  ...
});
```

## Public Assets

You'll want to add your own CSS, JavaScript, images and other files to your project. In the examples above, we're including `/styles/site.min.css`. If you are using LESS, add `public/styles/site.less` to your project. We can leave this blank for now, but note Keystone will generate a `site.min.css` on run time.

Keystone will serve any static assets you place in the public directory. This path is specified in `keystone.js` by the `static` option.

Keystone will also automatically generate `.css` or compressed `.min.css` files when a corresponding `.less` file is found in the public folder, as specified in `keystone.js` by the `less` option. For more information on LESS, see [lesscss.org](http://lesscss.org).

## Writing Application Updates

Keystone includes an [Application Updates](/documentation/database/application-updates/) framework which can be used to apply one-off data changes against your database. Application update scripts can be convenient for seeding your database, transitioning existing data when models change, or running transformation scripts against your database. Since update scripts only run once per database, they are also very useful to ensure consistency across multiple deployments or environments.

Keystone's automatic update functionality is enabled in `keystone.js` by the `auto update` option.

When the option is set to `true`, Keystone will scan the `updates` directory for `.js` files, each of which should export a method accepting a single argument:

- next - the method to call when the update has finished running (including any internal callbacks)

Updates are ordered using [Semantic Versioning](https://semver.org), and Keystone will only run them once. Successfully executed updates are stored in your database, in a collection called `app_updates`.

Update file names should match the pattern `x.x.x-description.js` - anything after the first hyphen is ignored, so you can describe the update in the filename.

To automatically add a new Admin User when your app first launches, create an `updates/0.0.1-admin.js` file:

**updates/0.0.1-admin.js**
Update script to add the first admin (change to your own name, email and password)

```javascript
var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function(done) {
  new User.model({
    name: { first: 'Admin', last: 'User' },
    email: 'admin@keystonejs.com',
    password: 'admin',
    canAccessKeystone: true
  }).save(done);

};
```

> NOTE: You probably don't want to store your real password in the code, so it's a good idea to set the default password to something simple, then sign in and change it using Keystone's Admin UI after you start your app for the first time.

## Starting Keystone

Now you're ready to run your application, so execute the following in your project's main folder:

`npm start`

Keystone will automatically apply any pending application updates and then start a web server on the default port, 3000.

To see your home page, point your browser at [localhost:3000](http://localhost:3000). You should see a **Hello World!** message.

To sign in to Keystone's Admin UI, go to [localhost:3000/keystone](http://localhost:3000/keystone). Use the email and password you put in the update script above to sign in, and you'll be redirected to Keystone's home page.

## Next Steps

... you're done! Well, not really. It's time to start building your app now. For more information on list options and the field types Keystone supports, browse the [Database Configuration](/documentation/database/) documentation.

You should also [Follow @KeystoneJS on Twitter](https://twitter.com/keystonejs) for news and updates, [Star KeystoneJS on GitHub](https://github.com/keystonejs/keystone), and discuss this guide (or anything KeystoneJS related) on the [KeystoneJS Community Slack](https://launchpass.com/keystonejs).

Enjoy using KeystoneJS!
