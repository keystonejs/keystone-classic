![KeystoneJS](http://keystonejs.com/images/logo.svg)
===================================

[![Build Status](https://travis-ci.org/keystonejs/keystone.svg?branch=master)](https://travis-ci.org/keystonejs/keystone)

[KeystoneJS](http://keystonejs.com) is a powerful Node.js content management system and web app framework built on [express](http://expressjs.com) and [mongoose](http://mongoosejs.com). Keystone makes it easy to create sophisticated web sites and apps, and comes with a beautiful auto-generated Admin UI.

Check out [keystonejs.com](http://keystonejs.com) for documentation and guides.

You can also deploy a starter project to [Heroku](https://www.heroku.com/) for free to try it out:

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/JedWatson/keystone-starter)


## Keystone 4.0 Beta Released!!!

We've been working on a major update to KeystoneJS for the last year, and it's a complete rebuild of Keystone's Admin UI and internal architecture. Improvements include:

* The Admin UI has been re-written as a single page app using React.js, Redux and Elemental UI
* An updated API for Lists and Fields
* Better support for using Keystone without Express, or with your own express instance
* Core functionality has been refactored and we're breaking Keystone up into separate npm packages
* Startup time has been significantly reduced
* LocalFile, S3File and AzureFile have been replaced by a new generic `keystone.Storage` engine and File field
* We have much higher unit and end-to-end test coverage

Please try out the beta and let us know what you think:

```
npm install --save keystone@next
```

We'll be publishing a summary of the new features, changes and improvements as we get closer to the final release. In the meantime, see the [v0.3 -> v4.0 Upgrade Guide](https://github.com/keystonejs/keystone/blob/master/docs/guides/v0.3-to-v4.0-Upgrade-Guide.md) for information on what's changed.

Also check out our [demo site](http://demo.keystonejs.com/), which has been updated to the new version!


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

Use our [Yeoman Generator](https://github.com/keystonejs/generator-keystone) to get up and running with KeystoneJS quickly, then check out our getting started guide &amp; docs at [keystonejs.com/docs/getting-started](http://keystonejs.com/docs/getting-started).

We have a demo website at [demo.keystonejs.com](http://demo.keystonejs.com/) where you can play with the Keystone Admin UI, and you can [read the source](https://github.com/keystonejs/keystone-demo) to see how it was built.

### Community

We have a friendly, growing community and welcome everyone to get involved.

Here are some ways:

* Follow [@KeystoneJS](https://twitter.com/KeystoneJS) on twitter for news and announcements
* Vote on the next features on [ProductPains](https://productpains.com/product/keystonejs)
* Chat with us [![Join the chat at https://gitter.im/keystonejs/keystone](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/keystonejs/keystone?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
* If you've got ideas, questions or need some advice, check out the [KeystoneJS Google Group](https://groups.google.com/d/forum/keystonejs)
* Ask technical questions on [Stack Overflow](http://stackoverflow.com/questions/tagged/keystone.js) and tag them `keystonejs`
* Report bugs and issues on our [issue tracker](https://github.com/keystonejs/keystone/issues)
* ... or preferably, submit pull request with patches and / or new features

We love to hear feedback about Keystone and the projects you're using it for. Ping us at [@KeystoneJS](https://twitter.com/KeystoneJS) on twitter.

#### Related Projects
If you are using KeystoneJS in any projects we encourage you to add it to our [Related Projects Page](https://github.com/keystonejs/keystone/wiki/Related-Projects). This is also the place to find generators and such that bundle KeystoneJS.

### Contributing

If you can, please contribute by reporting issues, discussing ideas, or submitting pull requests with patches and new features. We do our best to respond to all issues and pull requests within a day or two, and make patch releases to npm regularly.

If you're going to contribute code, please follow our [coding standards](https://github.com/keystonejs/keystone/wiki/Coding-Standards) and read our [CONTRIBUTING.md](https://github.com/keystonejs/keystone/blob/master/CONTRIBUTING.md).

## Usage

**Check out the [KeystoneJS Getting Started Guide](http://keystonejs.com/getting-started) to start using KeystoneJS.**

### Installation

The easiest way to get started with Keystone is to use the Yeoman generator:

```bash
$ npm install -g generator-keystone
$ yo keystone
```

Answer the questions, and the generator will create a new project based on the options you select, and install the required packages from **npm**.

Alternatively, to include Keystone in an existing project or start from scratch (without Yeoman), specify `keystone: "^0.3.9"` in the `dependencies` array of your `package.json` file, and run `npm install` from your terminal.

Then read through the [Documentation](http://keystonejs.com/docs) and the [Example Projects](http://keystonejs.com/examples) to understand how to use it.

### Configuration

Config variables can be passed in an object to the `keystone.init` method, or can be set any time before `keystone.start` is called using `keystone.set(key, value)`. This allows for a more flexible order of execution (e.g. if you refer to Lists in your routes, you can set the routes after configuring your Lists, as in the example above).

See the [KeystoneJS configuration documentation](http://keystonejs.com/docs/configuration) for details and examples of the available configuration options.

### Database field types

Keystone builds on the basic data types provided by mongo and allows you to easily add rich, functional fields to your application's models.

You get helper methods on your models for dealing with each field type easily (such as formatting a date or number, resizing an image, getting an array of the available options for a select field, or using Google's Places API to improve addresses) as well as a beautiful, responsive admin UI to edit your data with.

See the [KeystoneJS database documentation](http://keystonejs.com/docs/database) for details and examples of the various field types, as well as how to set up and use database models in your application.

Keystone's field types include:

*	[Boolean](http://keystonejs.com/docs/database/#fieldtypes-boolean)
*	[Color](http://keystonejs.com/docs/database/#fieldtypes-color)
*	[Date](http://keystonejs.com/docs/database/#fieldtypes-date)
*	[Datetime](http://keystonejs.com/docs/database/#fieldtypes-datetime)
*	[Email](http://keystonejs.com/docs/database/#fieldtypes-email)
*	[Html](http://keystonejs.com/docs/database/#fieldtypes-html)
*	[Key](http://keystonejs.com/docs/database/#fieldtypes-key)
*	[Location](http://keystonejs.com/docs/database/#fieldtypes-location)
*	[Markdown](http://keystonejs.com/docs/database/#fieldtypes-markdown)
*	[Money](http://keystonejs.com/docs/database/#fieldtypes-money)
*	[Name](http://keystonejs.com/docs/database/#fieldtypes-name)
*	[Number](http://keystonejs.com/docs/database/#fieldtypes-number)
*	[Password](http://keystonejs.com/docs/database/#fieldtypes-password)
*	[Select](http://keystonejs.com/docs/database/#fieldtypes-select)
*	[Text](http://keystonejs.com/docs/database/#fieldtypes-text)
*	[Textarea](http://keystonejs.com/docs/database/#fieldtypes-textarea)
*	[Url](http://keystonejs.com/docs/database/#fieldtypes-url)
*	[Azure File](http://keystonejs.com/docs/database/#fieldtypes-azurefile)  
*	[CloudinaryImage](http://keystonejs.com/docs/database/#fieldtypes-cloudinaryimage)
*	[CloudinaryImages](http://keystonejs.com/docs/database/#fieldtypes-cloudinaryimages)
*	[Embedly](http://keystonejs.com/docs/database/#fieldtypes-embedly)
*	[LocalFile](http://keystonejs.com/docs/database/#fieldtypes-localfile)
*	[S3 File](http://keystonejs.com/docs/database/#fieldtypes-s3file)

Keystone also has [Relationship fields](http://keystonejs.com/docs/database#relationships) for managing one-to-many and many-to-many relationships between different models.

### Running KeystoneJS in Production

When you deploy your KeystoneJS app to production, be sure to set your `ENV` environment variable to `production`.
You can do this by setting `NODE_ENV=production` in your `.env` file, which gets handled by [dotenv](https://github.com/motdotla/dotenv).

Setting your environment enables certain features, including template caching, simpler error reporting and html minification, that are important in production but annoying in development.

### Linking Keystone for Development and Testing

If you want to test or develop against the `master` branch of KeystoneJS (or against your own branch), rather than a published version on **npm**, you just need to check it out then use `npm link` to link it to your project. On Mac OS, this is done like this:

*	Clone KeystoneJS locally, e.g. to `~/Development/KeystoneJS`
*	From the KeystoneJS directory, run `sudo npm link` (you will need to enter your system password)
*	From your project directory, e.g. `~/Development/MySite` (the one with your `package.json` file in it) run `npm link keystone`. This will create a link between `~/Development/MySite/node_modules/keystone` and `~/Development/KeystoneJS`.

Then `require('keystone')` normally in your app - the development copy will be used. Note that running `npm update` will ignore new versions of keystone that have been published.

To go back to using a published version of KeystoneJS from npm, from your project directory, run `npm unlink keystone` then `npm install`.

#### Testing
To run the test suite run `npm test`.

## Thanks

KeystoneJS is a free and open source community-driven project. Thanks to our many  [contributors](https://github.com/keystonejs/keystone/graphs/contributors) and  [users](https://github.com/keystonejs/keystone/stargazers) for making it great.

Keystone's development is led by [Jed Watson](https://github.com/JedWatson), [Joss Mackison](https://github.com/jossmac) and [Max Stoiber](https://github.com/mxstbr) and supported by [Thinkmill](http://thinkmill.com.au) in Sydney, Australia.


## License

(The MIT License)

Copyright (c) 2016 Jed Watson

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
