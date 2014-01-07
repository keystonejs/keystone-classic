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

See the [KeystoneJS configuration documentation](http://keystonejs.com/guide/config) for details and examples of the available
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

See the [KeystoneJS database documentation](http://keystonejs.com/guide/data) for details and examples of the various field types,
as well as how to set up and use database models in your application.

Keystone's field types include:

*	[Boolean](http://keystonejs.com/guide/data#field_boolean)
*	[Text](http://keystonejs.com/guide/data#field_text)
*	[Textarea](http://keystonejs.com/guide/data#field_textarea)
*	[Email](http://keystonejs.com/guide/data#field_email)
*	[Url](http://keystonejs.com/guide/data#field_url)
*	[Html](http://keystonejs.com/guide/data#field_html)
*	[Date](http://keystonejs.com/guide/data#field_date)
*	[Datetime](http://keystonejs.com/guide/data#field_datetime)
*	[Key](http://keystonejs.com/guide/data#field_key)
*	[Number](http://keystonejs.com/guide/data#field_number)
*	[Money](http://keystonejs.com/guide/data#field_money)
*	[Select](http://keystonejs.com/guide/data#field_select)
*	[Markdown](http://keystonejs.com/guide/data#field_markdown)
*	[Name](http://keystonejs.com/guide/data#field_name)
*	[Password](http://keystonejs.com/guide/data#field_password)
*	[Location](http://keystonejs.com/guide/data#field_location)
*	[CloudinaryImage](http://keystonejs.com/guide/data#field_cloudinaryimage)
*	[CloudinaryImages](http://keystonejs.com/guide/data#field_cloudinaryimages)
*	[S3 File](http://keystonejs.com/guide/data#field_s3file)
*	[Embedly](http://keystonejs.com/guide/data#field_embedly)

Keystone also has [Relationship fields](http://keystonejs.com/guide/data#relationships) for managing one-to-many and many-to-many
relationships between different models.


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
