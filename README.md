![KeystoneJS](http://v3.keystonejs.com/images/logo.svg)
===================================

[![Build Status](https://travis-ci.org/keystonejs/keystone.svg?branch=master)](https://travis-ci.org/keystonejs/keystone)

 - [About Keystone](#about)
 - [Getting Started](#getting-started)
 - [Community](#community)
 - [Contributing](#contributing)
 - [License](#license)

## About Keystone

[KeystoneJS](http://keystonejs.com) is a powerful Node.js content management system and web app framework built on the [Express](https://expressjs.com/) web framework and [Mongoose ODM](http://mongoosejs.com). Keystone makes it easy to create sophisticated web sites and apps, and comes with a beautiful auto-generated Admin UI.

### Documentation

For Keystone v4 documentation and guides, see [keystonejs.com](https://keystonejs.com).

For Keystone v0.3 documentation, see [v3.keystonejs.com](https://v3.keystonejs.com).

### Keystone 4.0 Release Candidate (RC)

We've been working on a major update to KeystoneJS. Keystone 4 is a complete rebuild of Keystone's Admin UI and internal architecture.

Improvements include:

* The Admin UI has been re-written as a single page app using [React.js](https://reactjs.org), [Redux](https://redux.js.org/), and [Elemental UI](http://elemental-ui.com/)
* An updated API for Lists and Fields
* Better support for using Keystone without Express, or with your own express instance
* Core functionality has been refactored and we're breaking Keystone up into separate npm packages
* Startup time has been significantly reduced
* LocalFile, S3File, and AzureFile have been replaced by a new generic `keystone.Storage` engine and File field
* We have much higher unit and end-to-end test coverage

Please try out Keystone 4 and let us know what you think:

```
npm install --save keystone
```

We'll be publishing a summary of the new features, changes, and improvements as we get closer to the final release. In the meantime, see the [v0.3 -> v4.0 Upgrade Guide](https://keystonejs.com/guides/v-0-3-to-v-4-0-upgrade-guide) for information on what's changed.

Also check out our [demo site](http://demo.keystonejs.com), which has been updated to the new version!

## Getting Started

This section provides a short intro to Keystone. Check out the [Getting Started Guide](https://keystonejs.com/getting-started) in the Keystone documentation for a more comprehensive introduction.

### Installation

The easiest way to get started with Keystone is to use the Yeoman generator:

```bash
$ npm install -g generator-keystone
$ yo keystone
```

Answer the questions, and the generator will create a new project based on the options you select, and install the required packages from **npm**.

Alternatively, to include Keystone in an existing project or start from scratch (without Yeoman), specify `keystone: "4.0.0"` in the `dependencies` array of your `package.json` file, and run `npm install` from your terminal.

Then read through the [Documentation](https://keystonejs.com/documentation) and the [Example Projects](http://v3.keystonejs.com/examples) to understand how to use it.

### Configuration

Config variables can be passed in an object to the `keystone.init` method, or can be set any time before `keystone.start` is called using `keystone.set(key, value)`. This allows for a more flexible order of execution. For example, if you refer to Lists in your routes you can set the routes after configuring your Lists.

See the [KeystoneJS configuration documentation](https://keystonejs.com/documentation/configuration) for details and examples of the available options.

### Database field types

Keystone builds on the basic data types provided by MongoDB and allows you to easily add rich, functional fields to your application's models.

You get helper methods on your models for dealing with each field type easily (such as formatting a date or number, resizing an image, getting an array of the available options for a select field, or using Google's Places API to improve addresses) as well as a beautiful, responsive admin UI to edit your data with.

See the [KeystoneJS database documentation](https://keystonejs.com/documentation/database) for details and examples of the various field types, as well as how to set up and use database models in your application.

### Running KeystoneJS in Production

When you deploy your KeystoneJS app to production, be sure to set your `ENV` environment variable to `production`.

You can do this by setting `NODE_ENV=production` in your `.env` file, which gets handled by [dotenv](https://github.com/motdotla/dotenv).

Setting your environment enables certain features (including template caching, simpler error reporting, and HTML minification) that are important in production but annoying in development.

## Community

We have a friendly, growing community and welcome everyone to get involved:

* Follow [@KeystoneJS](https://twitter.com/KeystoneJS) on twitter for news and announcements.
* Ask technical questions on [Stack Overflow](http://stackoverflow.com/questions/tagged/keystone.js) and tag them `keystonejs.`
* Report bugs and feature suggestions on our GitHub [issue tracker](https://github.com/keystonejs/keystone/issues).
* Join the [KeystoneJS Slack](https://launchpass.com/keystonejs) for general discussion with the Keystone community and contributors.

We love to hear feedback about Keystone and the projects you're using it for. Ping us at [@KeystoneJS](https://twitter.com/KeystoneJS) on Twitter.

### Contributing

If you can, please contribute by reporting issues, discussing ideas, helping answer questions from other developers, or submitting pull requests with patches and new features. We do our best to respond to all issues and pull requests, and make patch releases to npm regularly.

If you're going to contribute code, please follow our [coding standards](https://github.com/keystonejs/keystone/wiki/Coding-Standards) and read our [Contributing Guide](https://github.com/keystonejs/keystone/blob/master/CONTRIBUTING.md).

### Related Projects
If you are using KeystoneJS in any projects we encourage you to add to our [Related Projects Page](https://github.com/keystonejs/keystone/wiki/Related-Projects). This is also the place to find generators and other projects that bundle KeystoneJS.

### Thanks

KeystoneJS is a free and open source community-driven project. Thanks to our many [contributors](https://github.com/keystonejs/keystone/graphs/contributors) and [users](https://github.com/keystonejs/keystone/stargazers) for making it great.

Keystone's development has been led by key contributors including [Jed Watson](https://github.com/JedWatson), [Joss Mackison](https://github.com/jossmac), and [Max Stoiber](https://github.com/mxstbr) and is proudly supported by [Thinkmill](https://thinkmill.com.au) in Sydney, Australia.

## License

(The MIT License)

Copyright (c) 2016-2018 Jed Watson

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
