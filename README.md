[KeystoneJS](http://keystonejs.com)
===================================

KeystoneJS is a powerful new Node.js content management system and web app framework built on [express](http://expressjs.com) and [mongoose](http://mongoosejs.com) that makes it easy to create sophisticated web sites and apps, and gives you a beautiful, auto-generated Admin UI.

To get started, check out [keystonejs.com](http://keystonejs.com)!

## About

Keystone gives you:
*	A simple way to create an Express web app with custom routes, templates and models
*	Out of the box session management and authentication
*	Enhanced `models` with additional field types and functionality, building on those
	natively supported by Mongoose
*	An updates framework for managing data updates or initialisation
*	A beautiful Admin UI based on the defined `models`
*	Integration with Coudinary for image uploading, storage and resizing
*	Integration with Mandrill for sending emails easily
*	Integration with Embedly for powerful video and rich media embedding tools

Getting Started guide &amp; documentation can be found at [keystonejs.com/guide](http://keystonejs.com/guide)

To see a working demo of Keystone, visit [demo.keystonejs.com](http://demo.keystonejs.com/)

View the [example project](https://github.com/JedWatson/keystone-demo) to see how to set up
a simple Keystone app.

Discuss on the [KeystoneJS Google Group](https://groups.google.com/d/forum/keystonejs)

### SydJS Sample Site

For an example of how to set up a more sophisticated website with Keystone, check out the
[SydJS Website](http://www.sydjs.com) and [source code](https://github.com/JedWatson/sydjs-site).


### Contributing

KeystoneJS is a big vision, and we'd love all the help we can get realising it.

Please feel free to contribute by reporting issues, discussing ideas, or submitting pull requests with patches and new features. We do our best to respond to all issues and pull requests within a day or two, and make patch releases to npm regularly.

We're also interested in hearing feedback about projects you're using Keystone for, and while we're working on better guides and documentation, are happy to give advice if you get stuck.

If you're going to contribute code, please try and mimic the existing code standards - we follow [AirBNB's Javascript Style Guide](https://github.com/airbnb/javascript) fairly closely, with the exception of using tab indentation.


## Usage

**New documentation is up at [keystonejs.com/guide](http://keystonejs.com/guide) (but there's still a lot to add!)**

The documentation below will remain here until it has been fully migrated.


### Installation

`npm install keystone`

Then:

*	`require` it in your web.js (or app.js, etc)
*	initialise it with configuration variables
*	define your lists (similar to mongoose models)
*	set up your routes
*	start it

Keystone will automatically set up Express and Mongoose, although you can provide your own versions
and have explicit control over your application configuration (see **advanced usage**, below).


### Linking Keystone for Development and Testing

If you want to test or develop against the `master` branch of KeystoneJS (or against your own branch), rather than a published version on **npm**, you just need to check it out then use `npm link` to link it to your project. On Mac OS, this is done like this:

*	Checkout KeystoneJS locally, e.g. to `~/Development/KeystoneJS`
*	From the KeystoneJS directory, run `sudo npm link` (you will need to enter your system password)
*	From your project directory, e.g. `~/Development/MySite` (the one with your `package.json` file in it) run `npm link keystone`. This will create a link between `~/Development/MySite/node_modules/keystone` and `~/Development/KeystoneJS`.

Then `require('keystone')` normally in your app - the development copy will be used. Note that running `npm update` will ignore new versions of keystone that have been published.

To go back to using a published version of KeystoneJS from npm, from your project directory, run `npm unlink keystone` then `npm install`.


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
*	`favicon` - the path to your application's favicon, passed to `express.favicon`, exclude if you don't have a favicon
*	`less` - the path to your .less templates, passed to `less-middleware`, exclude if you don't use LESS
*	`static` - the path to your application's static resources (public files), exclude if you don't want static resources
*	`compress` - (`Boolean`) whether to include the `Express.compress` middleware
*	`views` - the folder containing your view templates, passed to `express.set('views')` and used by the `keystone.View` Class
*	`404` - path to your 404 view template, or a function to handle 404s (standard Express signature of `function(req, res)`)
*	`view engine` - the template engine to use for your views, passed to `express.set('view engine')`
*	`locals` - (`Object`) default locals to pass to your view templates
*	`auto update` - (`Boolean`) automatically apply updates in your application's `/updates` folder using Keystone's Updates framework
*	`mongo` - the connection URL for your application's mongo database, passed to `mongoose.connect`
*	`auth` - callback function to authenticate a request, or `true` to use Keystone's native session management
*	`user model` - the key of the Keystone List for users, required if you're using native session management
*	`cookie secret` - the cookie secret to use for Express's cookie parser
*	`emails` - the path of your email templates, for use with the `keystone.Email` Class
*	`mandrill api key` - your mandrill API key to use with the `keystone.Email` Class
*	`email rules` - find & replace rules for pre-parsing email templates, useful to help with local vs. production absolute paths for images
*	`cloudinary config` `{cloud_name: '', api_key: '', api_secret: ''}` - alternatively set `process.env.CLOUDINARY_URL`
*	`cloudinary prefix` - prefix for all native tags added to uploaded images
*	`embedly api key` - API key to use for `embedly` fields
*	`google api key` - API key to use for `google maps` fields
*	`default region` - This parameter takes a region code, specified as a [IANA language region](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry) subtag.
*	`logger` - when set, Keystone includes the `express.logger` middleware and passes it the value
*	`signout` - href for the signout link in the top right of the UI, automatically set if you use native session management

See `Keystone.prototype.start` in `/index.js` to understand how these settings are used, and how the Express application
is initialised.


### Field Types

**New field types guide is up at [keystonejs.com/guide/data](http://keystonejs.com/guide/data)**

Keystone builds on the basic data types provided by mongo and allows you to easily add rich,
functional fields to your application's models.

You get helper methods on your models for dealing with each field type easily (such as 
formatting a date or number, resizing an image, getting an array of the available options
for a select field, or using Google's Places API to improve addresses) as well as a beautiful,
responsive admin UI to edit your data with.

Keystone's basic field types include:

*	`boolean` (`checkbox`)
*	`text` (`string`)
*	`textarea` (`string`)
*	`email` (`string`)
*	`url` (`string`)
*	`html` (`string`, with an optional wysiwyg editor)
*	`date`* (`date`)
*	`datetime`* (`date`)
*	`key` (`string`)
*	`number`* (`number`)
*	`money`* (`number`)

*Fields marked with a * provide a `format` method - numbers use [numeraljs](http://numeraljs.com),
dates use [moment](http://momentjs.com)*

Keystone's advanced field types include:

*	`select` (`String` or `Number`) - renders as a select field
	*	`options` must be provided as a list or array
	*	Provides a `format` method for getting the label of the stored value, as set in the
		`options` array.
	*	Provides a `pluck` method for getting the label
*	`markdown` (`Object`)
	*	`md` (`String`) - source markdown
	*	`html` (`String`) - generated html
	*	Converts markdown to html when `md` is set
*	`name` (`Object`)
	*	`first` (`String`)
	*	`last` (`String`)
	*	Provides a `full` virtual getter and setter
*	`password` (`String`)
	*	Automatically encrypted with bcrypt
	*	Provides a `compare` method for testing against the stored hash
*	`location`
	*	`name` (`String`) - building name
	*	`number` (`String`) - unit or shop number
	*	`street1` (`String`) - street address
	*	`street2` (`String`) - second street address
	*	`suburb` (`String`)
	*	`state` (`String`)
	*	`postcode` (`String`)
	*	`country` (`String`)
	*	`geo` (`Longitude`, `Latitude`) - 2dsphere indexed lat/png pair
	*	Provides an `googleLookup` method that returns the best match for the stored value on
		Google's Places API. Requires a Google Maps API Key to be provided, and should only be
		used in accordance with Google's terms of service.
	*	*Note: this field has been based on Australian address formats, and should be updated
		to be more friendly for other international formats.*
*	`cloudinaryimage` (`Object`)
	*	Automatically manages images stored in [cloudinary](http://cloudinary.com).
	*	Provides an `exists` virtual for detecting whether the field stores an image
	*	Has the built in ability to upload/delete images to/from cloudinary, as well as methods
		for retrieving various versions of the image for display:
		*	`src(options)` - returns the url of the image, accepts all options cloudinary supports
		*	`tag(options)` - returns an `<img>` tag
		*	`scale(width, height, options)` - scales the image to fit the exact width and height,
			retaining aspect ratio
		*	`fit(width, height, options)` - scales the image to fit within the specified width and height,
			retaining aspect ratio
		*	`lfit(width, height, options)` - scales the image to fit within the specified width and height,
			retaining aspect ratio (without exceeding the original dimensions)
		*	`limit(width, height, options)` - scales the image (down only) to fit within the specified width
			and height, retaining aspect ratio
		*	`fill(width, height, options)` - scales the image to fill the specified width and height
		*	`crop(width, height, options)` - crops the image to fill the specified width and height
		*	`pad(width, height, options)` - pads the image to fill the specified width and height
		*	`lpad(width, height, options)` - pads the image to fill the specified width and height (without
			exceeding the original dimensions)
		*	`thumbnail(width, height, options)` - crops the image to fill the specified width and height
	*	See [Cloudinary's Transformation Documentation](http://cloudinary.com/documentation/image_transformations)
		for more information on the supported options and transformations.
*	`cloudinaryimages` (`Array`)
	*	Stores multiple images in a array as a nested Schema, which exposes the same methods as
		the `cloudinaryimage` field
	*	Allows multiple images to be uploaded / removed / deleted in the Admin UI
*	`s3file` (`Object`)
	*	Automatically manages files stored in [amazon s3](http://aws.amazon.com/s3).
	*	Provides an `exists` virtual for detecting whether the field stores a file
	*	Has the built in ability to upload/delete file to/from amazon s3
	*	Fields:
		*	`exists` (`Boolean`)
		*	`filename` (`String`)
		*	`type` (`String`)
		*	`filesize` (`Number`)
		*	`url` (`String`)
*	`embedly` (`Object`)
	*	Automatically passed the value stored in another field to the [embedly](http://embed.ly)
		API to extract useful information like provider, type, full URL, HTML embed code, width,
		height, thumbnail picture and more.
	*	Requires the option `from` (`String`) to be set to a valid field (or path) in the model. An API call
		to embedly will be made when this value changes, and the result will be cached in the
		`embedly` field.
	*	Supports the option `options` (`Object`) which will be passed as arguments to the embedly API
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

*	`label` (`String`) the label of each field is guessed by the path, this can be set to override the
	default.
*	`required` (`Boolean`) validates that the field is set
*	`noedit` (`Boolean`) renders the field as read-only in the admin UI
*	`note` (`String`) is displayed with the field in the admin UI
*	`collapse` (`Boolean`) hides the field behind a '+ add ...' link in the admin UI when it has
	no value (to simplify complex forms)
*	`dependsOn` (`Object`) hides the field in the admin UI unless the specified conditions (other
	field values) are met

All the standard mongoose options for schema paths are passed through, such as `required`,
`index`, etc. meaning anything you can do in mongoose / mongo you can do with fields in Keystone.


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


### Advanced Usage

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


## Thanks

A massive thanks to the people & projects that have been the foundation of 
Keystone or helped during its development, including

* [Node.js](http://nodejs.org), obviously :)
* [ExpressJS](http://expressjs.com) (*the* webserver for node.js)
* [MongoDB](http://www.mongodb.org) (for the great database)
* [Mongoose](http://mongoosejs.com) (for the ODM that makes this easier)
* [Bootstrap](http://getbootstrap.com) (for the great css framework, you guys make clean, responsive UI easy)
* [Cloudinary](https://cloudinary.com) (for the amazing image service)
* [Embedly](http://embed.ly) (for the great api)
* [Google](https://developers.google.com) (for the maps)
* [Heroku](http://www.heroku.com) (for the servers)
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
