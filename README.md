Keystone
========

Node.js content management system and web app framework, MIT Licensed.

## About

Keystone is designed to be used in a web application built on Express and Mongoose.

Keystone provides:
*	A simple way to create an Express web app with custom routes, templates and models
*	Out of the box session management and authentication
*	Enhanced `models` with additional field types and functionality, building on those
	natively supported by Mongoose
*	An updates framework for managing data updates or initialisation
*	A beautiful Admin UI based on the defined `models`
*	Integration with Coudinary for image uploading, storage and resizing
*	Integration with Mandrill for sending emails easily

For more information, visit [keystonejs.com](http://keystonejs.com)

To see a working demo of Keystone, visit [demo.keystonejs.com](http://demo.keystonejs.com/)

View the [example project](https://github.com/JedWatson/keystone-demo) to see how to set up
a simple Keystone app.

Discuss on the [keystonejs Google Group](https://groups.google.com/d/forum/keystonejs)


### Field Types

Keystone builds on the basic data types provided by mongo and allows you to easily add rich,
functional fields to your application's models.

You get helper methods on your models for dealing with each field type easily (such as 
formatting a date or number, resizing an image, getting an array of the available options
for a select field, or using Google's Places API to improve addresses) as well as a beautiful,
responsive admin UI to edit your data with.

Keystone's basic field types include:

*	boolean (checkbox)
*	text (string)
*	textarea (string)
*	email (string)
*	url (string)
*	html (string, with an optional wysiwyg editor)
*	date* (date)
*	datetime* (date)
*	key (string)
*	number* (number)
*	money* (number)

*Fields marked with a * provide a `format` method - numbers use [numeraljs](http://numeraljs.com),
dates use [moment](http://momentjs.com)*

Keystone's advanced field types include:

*	`select` (string or number) - renders as a select field
	*	`options` must be provided as a list or array
	*	Provides a `format` method for getting the label of the stored value, as set in the
		`options` array.
	*	Provides a `pluck` method for getting the label
*	`name` (object)
	*	`first` (string)
	*	`last` (string)
	*	Provides a `full` virtual getter and setter
*	`password` (string)
	*	Automatically encrypted with bcrypt
	*	Provides a `compare` method for testing against the stored hash
*	`location`
	*	`name` (string) - building name
	*	`number` (string) - unit or shop number
	*	`street1` (string) - street address
	*	`street2` (string) - second street address
	*	`suburb` (string)
	*	`state` (string)
	*	`postcode` (string)
	*	`country` (string)
	*	`geo` (latitude, longitude) - 2dsphere indexed lat/png pair
	*	Provides an `googleLookup` method that returns the best match for the stored value on
		Google's Places API. Requires a Google Maps API Key to be provided, and should only be
		used in accordance with Google's terms of service.
	*	*Note: this field has been based on Australian address formats, and should be updated
		to be more friendly for other international formats. I am looking for feedback on this!*
*	`cloudinaryimage` (object)
	*	Automatically manages images stored in [cloudinary](http://cloudinary.com).
	*	Provides an `exists` virtual for detecting whether the field stores an image
	*	Has the built in ability to upload/delete images to/from cloudinary, as well as methods
		for retrieving various versions of the image for display:
		*	`src(options)` - returns the url of the image, accepts all options cloudinary supports
		*	`tag(options)` - returns an `<img>` tag
		*	`fit(width, height)` - scales the image to fit within the specified width and height,
			retining aspect ratio
		*	`limit(width, height)` - scales the image (down only) to fit within the specified width
			and height, retaining aspect ratio
		*	`fill(width, height)` - scales the image to fill the specified width and height
		*	`crop(width, height)` - crops the image to fill the specified width and height
		*	`thumbnail(width, height)` - crops the image to fill the specified width and height
*	`cloudinaryimages` (array)
	*	Stores multiple images in a array as a nested Schema, which exposes the same methods as
		the `cloudinaryimage` field
	*	Allows multiple images to be uploaded / removed / deleted in the Admin UI
*	`embedly` (object)
	*	Automatically passed the value stored in another field to the [embedly](http://embed.ly)
		API to extract useful information like provider, type, full URL, HTML embed code, width,
		height, thumbnail picture and more.
	*	Requires the option `from` to be set to a valid field (or path) in the model. An API call
		to embedly will be made when this value changes, and the result will be cached in the
		`embedly` field.
	*	Supports the option `options` (object) which will be passed as arguments to the embedly API
		along with the `from` field value. See 
		[Embedly's oEmbed API documentation](http://embed.ly/docs/embed/api/endpoints/1/oembed) for
		details on supported arguments.
	*	Fields:
		*	`exists` (`Boolean`)
		*	`type` (`String`)
		*	`title` (`String`)
		*	`url` (`String`)
		*	`width` (`Number`)
		*	`height` (`Number`)
		*	`version` (`String`)
		*	`description` (`String`)
		*	`html` (`String`)
		*	`authorName` (`String`)
		*	`authorUrl` (`String`)
		*	`providerName` (`String`)
		*	`providerUrl` (`String`)
		*	`thumbnailUrl` (`String`)
		*	`thumbnailWidth` (`Number`)
		*	`thumbnailHeight` (`Number`)

#### Common field options

Fields support several common options:

*	`label` (string) the label of each field is guessed by the path, this can be set to override the
	default.
*	`required` (boolean) validates that the field is set
*	`noedit` (boolean) renders the field as read-only in the admin UI
*	`note` (string) is displayed with the field in the admin UI
*	`collapse` (boolean) hides the field behind a '+ add ...' link in the admin UI when it has
	no value (to simplify complex forms)
*	`dependsOn` (object) hides the field in the admin UI unless the specified conditions (other
	field values) are met

All the standard mongoose options for schema paths are passed through, such as `required`,
`index`, etc. meaning anything you can do in mongoose / mongo you can do with fields in Keystone.


## Usage

`npm install keystone`

Then:

*	`require` it in your web.js (or app.js, etc)
*	initialise it with configuration variables
*	define your lists (similar to mongoose models)
*	set up your routes
*	start it

Keystone will automatically set up Express and Mongoose, although you can provide your own versions
and have explicit control over your application configuration (see the advanced example, below).

Keystone has only been tested with Jade and LESS as the html and css template engines for your
application, others that Express supports should work as well.


### Example application script (web.js)

If you want, Keystone can take care of everything required to set up your express app and
then start it for you.

	var keystone = require('keystone');

	keystone.init({
		
		'name': 'My Project',
		'brand': 'Project Admin',
		
		'favicon': 'public/favicon.ico',
		'less': 'public',
		'static': 'public',
		
		'views': 'templates/views',
		'view engine': 'jade',
		
		'auto update': true,
		'mongo': process.env.MONGOLAB_URI || 'mongodb://localhost/my-project',
		
		'auth': true,
		'user model': 'User',
		'cookie secret': '--- your secret ---',
		
		'emails': 'templates/emails',
		'mandrill api key': '--- your api key ---',
		'email rules': { find: '/images/', replace: (keystone.get('env') != 'production') ? 'http://localhost:3000/images/' : 'http://www.keystonejs.com/images/email/' },
		
		'cloudinary config': { cloud_name: '--- your cloud name ---', api_key: '--- your api key ---', api_secret: '--- your api secret ---' }
		
	});

	require('./models');

	keystone.set('routes', require('./routes'));
		
	keystone.start();

### Configuration

Config variables can be passed in an object to the `keystone.init` method, or can be set any time before `keystone.start` is
called using `keystone.set(key, value)`. This allows for a more flexible order of execution (e.g. if you refer to Lists in your
routes, you can set the routes after configuring your Lists, as in the example above).

Config variables include:

*	`name` - the name of your application (optional)
*	`brand` - the label displayed in the top left of the UI (optional)
*	`port` - the port to serve your application on, passed to `express.set('port')`, defaults to `env.PORT || 3000`
*	`favicon` - the path to your application's favicon, passed to `express.favico`, exclude if you don't have a favicon
*	`less` - the path to your .less templates, passed to `less-middleware`, exclude if you don't use LESS
*	`static` - the path to your application's static resources (public files), exclude if you don't want static resources
*	`compress` - (boolean) whether to include the `Express.compress` middleware
*	`views` - the folder containing your view templates, passed to `express.set('views')` and used by the `keystone.View` Class
*	`404` - path to your 404 view template, or a function to handle 404s (standard Express signature of `function(req, res)`)
*	`view engine` - the template engine to use for your views, passed to `express.set('view engine')`
*	`locals` - (object) default locals to pass to your view templates
*	`auto update` - (boolean) automatically apply updates in your application's `/updates` folder using Keystone's Updates framework
*	`mongo` - the connection URL for your application's mongo database, passed to `mongoose.connect`
*	`auth` - callback function to authenticate a request, or `true` to use Keystone's native session management
*	`user model` - the key of the Keystone List for users, required if you're using native session management
*	`cookie secret` - the cookie secret to use for Express's cookie parser
*	`emails` - the path of your email templates, for use with the `keystone.Email` Class
*	`mandrill api key` - your mandrill API key to use with the `keystone.Email` Class
*	`email rules` - find & replace rules for pre-parsing email templates, useful to help with local vs. production absolute paths for images
*	`cloudinary config` `{cloud_name: '', api_key: '', api_secret: ''}` - alternatively set `process.env.CLOUDINARY_URL`
*	`cloudinary prefix` - prefix for all native tags added to uploaded images
*	`logger` - when set, Keystone includes the `express.logger` middleware and passes it the value
*	`signout` - href for the signout link in the top right of the UI, automatically set if you use native session management

See `Keystone.prototype.start` in `/index.js` to understand how these settings are used, and how the Express application
is initialised.

### Notes

When you first `require` Keystone, it creates a single instance of itself. Do this somewhere
near the top of your app.js (or web.js, etc) file. Any subsequent `require('keystone')`
statements will return the same instance of Keystone.

Keystone can be locked down with the auth config. This must be a function matching the
express middleware pattern `fn(req,res,next)`. It will be called before any Keystone
routes are matched. If the user fails the validation check they should be redirected to
a signin or access-denied page implemented in the application.

The `NODE_ENV` environment variable is used to control template caching and html formatting,
and should be set to `production` for production environments.

### Headless Mode

You can start Keystone in 'headless' mode if you don't want it to bind routes or initialise the Express app.
This means you can still use Lists and other Keystone Classes without a web app (e.g. for unit testing).

Simply set the `headless` config variable to `true`.


## Advanced Usage

It is also possible to integrate keystone into an existing express app, without using the `start`
method. This assumes less about your app and provides a lot of flexibility.

You can provide a `mongoose` or `express` instance to Keystone's `connect` function before defining
any lists. `connect` returns `this` so you can do this in the `require` call.

`keystone.static(app)` adds Keystone's static route-handling middleware to the Express
app. It's a good idea to do this after your application's other static assets, before
any dynamic logic (e.g. cookie parsing, session authentication, body parsing, etc)

`keystone.routes(app);` adds Keystone's dynamic routes to the Express app router. This
can be done before or after your application's routes are defined, although if they come
after, you can explicitly lock down or replace Keystone routes with your own (so be careful).


### Example application script (web.js) - advanced

For full control over the express application, you can bind keystone by calling its
integration methods as part of the application configuration.

	var express = require('express'),
		app = express(),
		http = require('http'),
		path = require('path'),
		flash = require('connect-flash'),
		mongoose = require('mongoose'),
		keystone = require('keystone').connect(mongoose, app);

	require('./models');
	
	var session = require('./session');

	keystone.set('auth', session.keystoneAuth); // session.keystoneAuth is responsible for redirect visitors who shouldn't have access
	keystone.set('brand', 'Team 9'); // the brand is displayed in the top left hand corner of keystone

	// Initialise Express Application

	app.configure(function() {
		
		// Setup
		app.set('port', process.env.PORT || 3000);
		app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');
		
		// Serve static assets
		app.use(express.compress());
		app.use(express.favicon(__dirname + '/public/favicon.ico'));
		app.use(require('less-middleware')({ src: __dirname + '/public' }));
		app.use(express.static(path.join(__dirname, 'public')));
		keystone.static(app);
		
		// Handle dynamic requests
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser('-- your secret here --'));
		app.use(express.session());
		app.use(flash());
		app.use(session.persist);
		
		// Route requests
		app.use(app.router);

		// Handle 404s
		app.use(function(req, res, next) {
			res.status(404).send("Sorry, no page could be found at this address.");
		});

	});

	// Use Express error handler in the development environment
	app.configure('development', function() {
		app.use(express.errorHandler());
	});

	// Configure keystone routes
	keystone.routes(app);

	// Configure application routes
	require('./routes')(app);

	// Connect to the database and start the webserver
	mongoose.connect('localhost', '-- your database --');

	mongoose.connection.on('error', function() {
		console.error('Website failed to launch: mongo connection error', arguments);
	}).on('open', function() {
		http.createServer(app).listen(app.get('port'), function() {
			console.log("Website is ready on port " + app.get('port'));
		});
	});


### Routes.js

Keystone makes it easy to recursively import all routes in a directory, and provides
additional methods to the `request` and `response` express objects for APIs.

	var keystone = require('keystone'),
		importRoutes = keystone.importer(__dirname);

	// Load Routes
	var routes = {
		site: importRoutes('./site'),
		api: importRoutes('./api')
	};

	keystone.set('404', routes.site['404']);

	exports = module.exports = function(app) {

		// Site
		app.all('/', routes.site.index);
		
		// API
		app.all('/api*', keystone.initAPI);
		app.all('/api/contact', routes.api.contact);

	}

All route files are expected to export a single function like this:

	exports = module.exports = function(req, res) {
		res.render('site/index');
	}


## Thanks

A massive thanks to the people & projects that have been the foundation of 
Keystone or helped during its development, including

* [Node.js](http://nodejs.org), obviously :)
* [ExpressJS](http://expressjs.com) (*the* webserver for node.js)
* [MongoDB](http://www.mongodb.org) (for the great database)
* [Mongoose](http://mongoosejs.com) (for the ODM that makes this easier)
* [Bootstrap](http://getbootstrap.com) (for the great css framework, you guys make clean, responsive UI easy)
* [Cloudinary](https://cloudinary.com) (for the amazing image service)
* [Google](https://developers.google.com) (for the maps)
* [http://www.heroku.com](Heroku) (for the servers)
* [jQuery](http://jquery.com) (of course)
* [Underscore.js](http://underscorejs.org) (for making javascript better)
* [Yusuke Kamiyamane](http://p.yusukekamiyamane.com/) (for some of the icons)


## License

(The MIT License)

Copyright (c) 2013 Jed Watson

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
