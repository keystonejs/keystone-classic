![KeystoneJS](http://keystonejs.com/images/logo.svg)
===================================

![Build Status](https://travis-ci.org/JedWatson/keystone.svg)

[KeystoneJS](http://keystonejs.com) is a powerful new Node.js content management system and web app framework built on [express](http://expressjs.com) and [mongoose](http://mongoosejs.com) that makes it easy to create sophisticated web sites and apps, and gives you a beautiful, auto-generated Admin UI.

To get started, check out [keystonejs.com](http://keystonejs.com)!

## About

Keystone gives you:
*	A simple way to create a dynamic web site or app with well-structured routes, templates and models
*	A beautiful Admin UI based on the database models you define
*	Enhanced `models` with additional field types and functionality, building on those natively supported by Mongoose
*	Out of the box session management and authentication
*	An updates framework for managing data updates or initialisation
*	Integration with Cloudinary for image uploading, storage and resizing
*	Integration with Mandrill for sending emails easily
*	Integration with Google Places for clever location fields
*	Integration with Embedly for powerful video and rich media embedding tools

... plus a lot of other tools and utilities to make creating complex web apps easier.

Use our [Yeoman Generator](https://github.com/JedWatson/generator-keystone) to get up and running with KeystoneJS quickly, then check out our getting started guide &amp; docs at [keystonejs.com/docs/getting-started](http://keystonejs.com/docs/getting-started).

We have a demo website at [demo.keystonejs.com](http://demo.keystonejs.com/) where you can play with the Keystone Admin UI, and you can [read the source](https://github.com/JedWatson/keystone-demo) to see how it was built.

If you have ideas or questions, get in touch on the [KeystoneJS Google Group](https://groups.google.com/d/forum/keystonejs) or tweet at [@KeystoneJS](https://twitter.com/KeystoneJS) on twitter.


### SydJS Website

The primary contributors to Keystone are based in Sydney, Australia and KeystoneJS is written in Javascript, so it was only natural to create a site for the Sydney Javascript Community using it.

The [SydJS Website](http://www.sydjs.com) is a great example of a more sophisticated project than the Keystone Demo, and you can [view the source code](https://github.com/JedWatson/sydjs-site) to see how it was built.

We have also written a [SydJS Mobile App](https://github.com/bladey/sydjs-app) with Cordova, Backbone, Velocity.js and jQuery to demonstrate how Javascript can be used to create a native experience for mobile apps, running against a KeystoneJS back-end. For more, including our design resources, check out the [SydJS Showbag](http://www.sydjs.com/showbag).

If you run a community group, please feel free to copy our site and app and make them your own! And if you do, we'd love to hear from you.


### Contributing

KeystoneJS has a big vision, and the support of the community is an important part of making it a reality.

We love to hear feedback about Keystone and the projects you're using it for, and are happy to give advice on the [KeystoneJS Google Group](https://groups.google.com/d/forum/keystonejs) if you get stuck.

If you can, please contribute by reporting issues, discussing ideas, or submitting pull requests with patches and new features. We do our best to respond to all issues and pull requests within a day or two, and make patch releases to npm regularly.

If you're going to contribute code, please try and mimic the existing code standards - we follow [AirBNB's Javascript Style Guide](https://github.com/airbnb/javascript) fairly closely, with the exception of using tab indentation.


## Usage

**Check out the [KeystoneJS Documentation](http://keystonejs.com/docs) for a walk-through on how to use KeystoneJS.**

### Installation

The easiest way to get started with Keystone is to use the Yeoman generator.

To install it, type the following in your terminal:

    npm install -g yo
    npm install -g generator-keystone

Then, create a new folder for your project and from it, type the following in your terminal:

    yo keystone

This will create a new project based on the options you select, and install the required packages from **npm**.

After the intallation is complete, run this command to start Keystone:

    node keystone

Alternatively, to include Keystone in an existing project or start from scratch (without Yeoman), specify `keystone: "0.2.x"` in the `dependencies` array in your `package.json` file, and run `npm install` from your terminal.

Then read through the [Documentation](http://keystonejs.com/docs) and the [Example Projects](http://keystonejs.com/examples) to understand how to use it.


### Example application script (keystone.js)

Running in default mode, Keystone takes care of everything required to configure your application with Express, connect to your MongoDB database, and start the web server.

Here is an example of what your `keystone.js` (or `app.js`, etc) file may look like:

	var keystone = require('keystone');
    
	keystone.init({
		
		'name': 'My Project',
		'brand': 'Project',
		
		'favicon': 'public/favicon.ico',
		'less': 'public',
		'static': 'public',
		
		'views': 'templates/views',
		'view engine': 'jade',
		
		'auth': true,
		'user model': 'User',
		'cookie secret': '--- your secret ---',
		
		'auto update': true,
		
		'emails': 'templates/emails',
		'mandrill api key': '--- your api key ---',
		'email rules': { find: '/images/', replace: (keystone.get('env') != 'production') ? 'http://localhost:3000/images/' : 'http://www.keystonejs.com/images/email/' },
		
		'cloudinary config': { cloud_name: '--- your cloud name ---', api_key: '--- your api key ---', api_secret: '--- your api secret ---' }
		
	});
    
	keystone.import('models');
    
	keystone.set('routes', require('./routes'));
		
	keystone.start();


### Configuration

Config variables can be passed in an object to the `keystone.init` method, or can be set any time before `keystone.start` is
called using `keystone.set(key, value)`. This allows for a more flexible order of execution (e.g. if you refer to Lists in your
routes, you can set the routes after configuring your Lists, as in the example above).

See the [KeystoneJS configuration documentation](http://keystonejs.com/docs/configuration) for details and examples of the available
configuration options.

To understand how these settings are used, and how the Express application initialised, see `Keystone.prototype.start` in
`/index.js`.


### Database field types

Keystone builds on the basic data types provided by mongo and allows you to easily add rich,
functional fields to your application's models.

You get helper methods on your models for dealing with each field type easily (such as 
formatting a date or number, resizing an image, getting an array of the available options
for a select field, or using Google's Places API to improve addresses) as well as a beautiful,
responsive admin UI to edit your data with.

See the [KeystoneJS database documentation](http://keystonejs.com/docs/database) for details and examples of the various field types,
as well as how to set up and use database models in your application.

Keystone's field types include:

*	[Boolean](http://keystonejs.com/docs/database/#fieldtypes-boolean)
*	[Text](http://keystonejs.com/docs/database/#fieldtypes-text)
*	[Textarea](http://keystonejs.com/docs/database/#fieldtypes-textarea)
*	[Email](http://keystonejs.com/docs/database/#fieldtypes-email)
*	[Url](http://keystonejs.com/docs/database/#fieldtypes-url)
*	[Html](http://keystonejs.com/docs/database/#fieldtypes-html)
*	[Color](http://keystonejs.com/docs/database/#fieldtypes-color)
*	[Date](http://keystonejs.com/docs/database/#fieldtypes-date)
*	[Datetime](http://keystonejs.com/docs/database/#fieldtypes-datetime)
*	[Key](http://keystonejs.com/docs/database/#fieldtypes-key)
*	[Number](http://keystonejs.com/docs/database/#fieldtypes-number)
*	[Money](http://keystonejs.com/docs/database/#fieldtypes-money)
*	[Select](http://keystonejs.com/docs/database/#fieldtypes-select)
*	[Markdown](http://keystonejs.com/docs/database/#fieldtypes-markdown)
*	[Name](http://keystonejs.com/docs/database/#fieldtypes-name)
*	[Password](http://keystonejs.com/docs/database/#fieldtypes-password)
*	[Location](http://keystonejs.com/docs/database/#fieldtypes-location)
*	[CloudinaryImage](http://keystonejs.com/docs/database/#fieldtypes-cloudinaryimage)
*	[CloudinaryImages](http://keystonejs.com/docs/database/#fieldtypes-cloudinaryimages)
*	[LocalFile](http://keystonejs.com/docs/database/#fieldtypes-localfile)
*	[S3 File](http://keystonejs.com/docs/database/#fieldtypes-s3file)
*	[Embedly](http://keystonejs.com/docs/database/#fieldtypes-embedly)

Keystone also has [Relationship fields](http://keystonejs.com/docs/database#relationships) for managing one-to-many and many-to-many
relationships between different models.


### Running KeystoneJS in Production

When you deploy your KeystoneJS app to production, be sure to set your `ENV` environment variable to `production`.
You can do this by setting `NODE_ENV=production` in your `.env` file, which gets handled by [dotenv](https://github.com/scottmotte/dotenv).

Setting your environment enables certain features, including template caching, simpler error reporting and html minification, that are important in production but annoying in development.


### Linking Keystone for Development and Testing

If you want to test or develop against the `master` branch of KeystoneJS (or against your own branch), rather than a published version on **npm**, you just need to check it out then use `npm link` to link it to your project. On Mac OS, this is done like this:

*	Checkout KeystoneJS locally, e.g. to `~/Development/KeystoneJS`
*	From the KeystoneJS directory, run `sudo npm link` (you will need to enter your system password)
*	From your project directory, e.g. `~/Development/MySite` (the one with your `package.json` file in it) run `npm link keystone`. This will create a link between `~/Development/MySite/node_modules/keystone` and `~/Development/KeystoneJS`.

Then `require('keystone')` normally in your app - the development copy will be used. Note that running `npm update` will ignore new versions of keystone that have been published.

To go back to using a published version of KeystoneJS from npm, from your project directory, run `npm unlink keystone` then `npm install`.


### Advanced Usage

It is also possible to integrate keystone into an existing express app, without using the `start` method. This assumes less about your app and provides a lot of flexibility.

You can provide a `mongoose` or `express` instance to Keystone's `connect` function before defining any lists. `connect` returns `this` so you can do this in the `require` call.

`keystone.static(app)` adds Keystone's static route-handling middleware to the Express app. It's a good idea to do this after your application's other static assets, before any dynamic logic (e.g. cookie parsing, session authentication, body parsing, etc)

`keystone.routes(app);` adds Keystone's dynamic routes to the Express app router. This can be done before or after your application's routes are defined, although if they come after, you can explicitly lock down or replace Keystone routes with your own (so be careful).

### Mounting Keystone as a sub-app or creating a node module out of your Keystone project

You may also just want to mount Keystone as a sub-app within a larger express app, and still let Keystone run its full configuration and setup routine but not start its own http server (i.e. `embedded` mode). 

…Or you might also want to turn a Keystone project into a node module that can be embedded easily via `npm link` or `npm install`.

The following detailed example will cover both creating a node module as well as mounting the Keystone app as a sub-app within a larger Express based application. 

Let's say you have a solution broken out into a structure like so…

```
	/client
	/content
	/server
```

...where `/client` is some super awesome large scale single page client app written in [AngularJS](https://angularjs.org/) or [Polymer](http://www.polymer-project.org/), `/server` is a whiz-bang back end powered by [StrongLoop](http://strongloop.com/mobile-application-development/loopback/) or something else based on Express that serves up the data and maybe the built version of `/client`, and finally `/content` is a Keystone app that you want to use just for the awesome CMS modeling, querying, and automatic admin interface. In other words, you think Keystone is great at the content related data management and email stuff but don't really love its front end stuff (other than the admin app).

In this example, all three projects are their own node apps with their own `package.json` files. The `/content` app in this example might be the result of you using [Keystone's yeoman generator](https://github.com/JedWatson/generator-keystone) and then ripping out most of the stuff from `/routes` and `/templates` and just using `/models` and `/updates` and the email stuff.

You then want to integrate the `/content` app as a linked module inside of `/server` and mount it as a sub-app at the path `/content`.

**Your `/content/keystone.js` file would look something like this: **

```
// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv')().load();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	
	'name': 'Your App Name',
	'brand': 'Your App Name',
	
	'emails': 'templates/emails',
	
	'auto update': true,
	
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': 'your cookie secret'
	
});

// Load your project's Models

keystone.import('models');

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

keystone.set('email locals', {
	logo_src: '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});

// Setup replacement rules for emails, to automate the handling of differences
// between development a production.

// Be sure to update this rule to include your site's actual domain, and add
// other rules your email templates require.

keystone.set('email rules', [{
	find: '/images/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/images/' : 'http://localhost:3000/images/'
}, {
	find: '/keystone/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/keystone/' : 'http://localhost:3000/keystone/'
}]);

// Load your project's email test routes

keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'posts': ['posts', 'post-categories'],
	'galleries': 'galleries',
	'enquiries': 'enquiries',
	'users': 'users'
});

module.exports = keystone;

```

Notice the last line. Instead of starting the keystone server via `keystone.start()` you simply export the keystone object. This will allow you to easily embed this module in another application. 

You may also want to make an `app.js` file at the same level as `keystone.js` the does nothing more than require this exported object and starts the server. This is useful if you still want to hack on your models and test them in an isolated manner.

**`app.js`:**

```
var keystone = require('./keystone');

keystone.start();
```
The last piece of the setup for your embeddable Keystone project is to slightly modify the `package.json` file to include a `main` value. This is needed for the next step to work.

**`package.json`:**

```
{
  "name": "your-app-content",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "keystone": "~0.2.6",
    "async": "~0.2.9",
    "underscore": "~1.5.2",
    "dotenv": "0.0.3"
  },
  "engines": {
    "node": ">=0.10.22",
    "npm": ">=1.3.14"
  },
  "main": "keystone.js",
  "scripts": {
    "start": "app.js"
  }
}

```

Now to embed the Keystone project into your `/server` app as a node_module during development, just run `npm link` from within the `/content` project's root folder, followed by `npm link your-app-content` in the `/server` app's root folder (note: when doing the second `npm link`, replace `your-app-content` with the actual name of your `/content` app within its `package.json` file).

The next step for all this to work is to use `keystone.mount` in the server app. 

**Example `app.js` in `/server`:**

```
var express = require('express'),
	app = express();
	
app.keystone = require('your-app-content');

//...do your normal express setup stuff, add middleware and routes (but not static content or error handling middleware yet)

app.keystone.mount('/content', app, function() {
	//put your app's static content and error handling middleware here and start your server
});
```
Assuming you are using port `3000` to run the above example, you could then open a browser to `http://localhost:3000/content/keystone` to access your Keystone admin interface (hosted from your own higher level application).

Putting a reference to the keystone object directly on your app like we did above means you can now use all the powerful querying tools from your Keystone models in your app, perhaps behind some ridiculously secure ACL managed routes or something else fun like that.

And finally, if you _are_ using `dotenv` in your Keystone project to store your config in a `.env` file, you will also need to create a `.env` file at the root level of the `/server` project.

Now you have a fully functioning embeddable KeystoneJS module and you can achieve good separation of concerns between the development and testing of the back-end, the front-end, and the content.



## Thanks

KeystoneJS is a free and open source community-driven project. Thanks to our many [contributors](https://github.com/JedWatson/keystone/graphs/contributors) and [users](https://github.com/JedWatson/keystone/stargazers) for making it great.

Thanks to the following companies and projects whose work we have used or taken inspiration from in the making of KeystoneJS:

* [Node.js](http://nodejs.org)
* [Thinkmill](http://thinkmill.com.au)
* [ExpressJS](http://expressjs.com)
* [MongoDB](http://www.mongodb.org)
* [Mongoose](http://mongoosejs.com)
* [jQuery](http://jquery.com)
* [Underscore](http://underscorejs.org)
* [Bootstrap](http://getbootstrap.com)
* [Amazon](http://aws.amazon.com)
* [Heroku](http://www.heroku.com)
* [Google](https://developers.google.com)
* [Cloudinary](https://cloudinary.com)
* [Embedly](http://embed.ly)
* [Yusuke Kamiyamane](http://p.yusukekamiyamane.com/)


## License

(The MIT License)

Copyright (c) 2014 Jed Watson

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
