[KeystoneJS](http://keystonejs.com)
===================================

KeystoneJS is a powerful new Node.js content management system and web app framework built on [express](http://expressjs.com) and [mongoose](http://mongoosejs.com) that makes it easy to create sophisticated web sites and apps, and gives you a beautiful, auto-generated Admin UI.

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

If you run a community group, please feel free to copy our site and make it your own! And if you do, we'd love to hear from you.


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

*	[Boolean](http://keystonejs.com/docs/database#field_boolean)
*	[Text](http://keystonejs.com/docs/database#field_text)
*	[Textarea](http://keystonejs.com/docs/database#field_textarea)
*	[Email](http://keystonejs.com/docs/database#field_email)
*	[Url](http://keystonejs.com/docs/database#field_url)
*	[Html](http://keystonejs.com/docs/database#field_html)
*	[Date](http://keystonejs.com/docs/database#field_date)
*	[Datetime](http://keystonejs.com/docs/database#field_datetime)
*	[Key](http://keystonejs.com/docs/database#field_key)
*	[Number](http://keystonejs.com/docs/database#field_number)
*	[Money](http://keystonejs.com/docs/database#field_money)
*	[Select](http://keystonejs.com/docs/database#field_select)
*	[Markdown](http://keystonejs.com/docs/database#field_markdown)
*	[Name](http://keystonejs.com/docs/database#field_name)
*	[Password](http://keystonejs.com/docs/database#field_password)
*	[Location](http://keystonejs.com/docs/database#field_location)
*	[CloudinaryImage](http://keystonejs.com/docs/database#field_cloudinaryimage)
*	[CloudinaryImages](http://keystonejs.com/docs/database#field_cloudinaryimages)
*	[S3 File](http://keystonejs.com/docs/database#field_s3file)
*	[Embedly](http://keystonejs.com/docs/database#field_embedly)

Keystone also has [Relationship fields](http://keystonejs.com/docs/database#relationships) for managing one-to-many and many-to-many
relationships between different models.


### Running KeystoneJS in Production

When you deploy your KeystoneJS app to production, be sure to set your `ENV` environment variable to `production`.

This enables certain features, including template caching, simpler error reporting and html minification, that are important in production but annoying in development.


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
