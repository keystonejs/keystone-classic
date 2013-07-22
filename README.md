Prospekt
========


## Disclaimer

This project is currently under development, and unsupported. I strongly recommend waiting
for it to gain maturity before playing with it.


## About

Prospekt is designed to be used in a web application built on Express and Mongoose.

Prospekt provides:
*	Enhanced `models` with additional field types and functionality, building on those
	natively supported by Mongoose
*	Helpful utilities for generating webpages based on common `model` conventions and
	field types
*	An auto-generated Admin UI based on the defined `models`
*	Integration with Coudinary for image uploading, storage and resizing

Prospekt is *not* designed to execute as a standalone application.


## Installation & Requirements

Specific congurations are required in your main application script for Prospekt to work,
and assumptions are made in the code that this has been done correctly.

1.	Express ~3.2.6 and Mongoose ~3.6.13 must be included by your application, and must
	be `require`d *before* Prospekt
	
2.	Prospekt assumes that you have correctly configured, and successfully connected to,
	a Mongo database with Mongoose's default connection

3.	Connect-Flash ~0.1.1 must be included and configured in your Express app instance
	*before* you call `prospekt.routes(app)`. This also requires the configuration of
	`express.session()` in your Express app.


### Usage

When first `require`d, Prospekt creates a single instance of itself. Do this somewhere
near the top of your app.js (or web.js, etc) file. Any subsequent `require('prospekt')`
statements will return the same instance of Prospekt.

You must provide a `mongoose` instance to Prospekt's `connect` function before defining
any lists. `connect` returns `this` so you can do this in the `require` call.

Configuration variables can be set at any time, and include:

*	auth (callback function to authenticate a request, or 'native' to use native session management)
*	user model (list key for users if using native session management)
*	brand (label displayed in the top left of the UI)
*	cloudinary config `{cloud_name: '', api_key: '', api_secret: ''}` - alternatively set `process.env.CLOUDINARY_URL`
*	cloudinary prefix (prefix for all native tags added to uploaded images)
*	signout (href for the signout link in the top right of the UI)

Prospekt can be locked down with the auth config. This must be a function matching the
express middleware pattern `fn(req,res,next)`. It will be called before any Prospekt
routes are matched. If the user fails the validation check they should be redirected to
a signin or access-denied page implemented in the application.

`prospekt.static(app)` adds Prospekt's static route-handling middleware to the Express
app. It's a good idea to do this after your application's other static assets, before
any dynamic logic (e.g. cookie parsing, session authentication, body parsing, etc)

`prospekt.routes(app);` adds Prospekt's dynamic routes to the Express app router. This
can be done before or after your application's routes are defined, although if they come
after, you can explicitly lock down or replace Prospekt routes with your own.

The `NODE_ENV` environment variable is used to control template caching and html formatting,
and should be set to `production` for production environments.


## Examples

### Application script (web.js)

	process.env.NODE_ENV = process.env.NODE_ENV || 'development';

	var express = require('express'),
		http = require('http'),
		path = require('path'),
		flash = require('connect-flash'),
		mongoose = require('mongoose'),
		prospekt = require('prospekt').connect(mongoose);

	require('./models');

	var session = require('./lib/session');

	prospekt.set('auth', session.prospektAuth); // session.prospektAuth is responsible for redirect visitors who shouldn't have access
	prospekt.set('brand', 'Team 9'); // the brand is displayed in the top left hand corner of prospekt

	// Initialise Express Application
	var app = express();

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
		prospekt.static(app);
		
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

	// Configure prospekt routes
	prospekt.routes(app);

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


### Users Model

	var prospekt = require('prospekt'),
		Types = prospekt.Field.Types;

	var User = new prospekt.List('User');

	User.add({
		name: { type: Types.Name, required: true, index: true },
		email: { type: Types.Email, initial: true, required: true, index: true },
		password: { type: Types.Password, initial: true, required: true },
		isAdmin: { type: Boolean, initial: true }
	});

	User.addPattern('standard meta');
	User.defaultColumns = 'name, email, isAdmin';
	User.register();


### Subscribers Model

	var prospekt = require('prospekt'),
		Types = prospekt.Field.Types;

	var Subscriber = new prospekt.List('Subscriber');

	Subscriber.add({
		name: { type: Types.Name },
		email: { type: Types.Email, initial: true },
		phone: { type: String, initial: true, width: 'short' },
		relationship: { type: Types.Select, options: 'currentPlayer, previousPlayer, sponsor, supporter', initial: true },
		isSubscribed: { type: Boolean, default: true, label: 'Currently Subscribed?', initial: true },
		subscribedDate: { type: Date, default: Date.now },
		unsubscribedDate: { type: Date }
	});

	Subscriber.addPattern('standard meta');

	Subscriber.schema.pre('save', function(next) {
		if (this.isModified('subscribed')) {
			if (this.subscribed)
				this.subscribedDate = date.now();
			else
				this.unsubscribedDate = date.now();
		}	
		next();
	});

	Subscriber.defaultColumns = 'name, email, phone, relationship, isSubscribed';
	Subscriber.register();


## TODO

### Field Types

*	WYSIWYG
*	Image
*	Location
*	Object (single)
*	Objects (many)
*	Arrays (simple)

#### For later

*	Arrays (complex)
*	Nested Schemas

### List Screen

*	List filtering

### Validation

*	Integrate better with Mongoose's native validation capabilities
*	Integrate field validation with UI (so invlaid fiends are hilighted)
*	Client-side field validation
*	Form validation is duplicated between the list:create and item:update route logic



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