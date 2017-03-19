# Getting Started

KeystoneJS makes it easy to build database-driven websites, applications and APIs in node.js.

Under the hood, KeystoneJS uses the [express.js](expressjs.com) web server framework, and a [MongoDB](mongodb.com) database via the [mongoose](mongoosejs.com) object modelling framework.

## Simple vs. Flexible

Keystone is designed to make complicated things simple, without limiting the power or flexibility of node.js or the frameworks it is built on.
This guide will show you how to build a KeystoneJS website using the default project structure and options, using the keystone yeoman generator.
To learn more about how things work under the hood, and how you can extend or replace features, we strongly recommend our [setting up keystone](/setting-up) guide, or reading the [source code](https://github.com/keystonejs/keystone).

## Prerequisites
1. Before you begin, make sure you have [Node.js](nodejs.org) and [MongoDB](mongodb.com/download) installed.
2. You'll need a reasonable working knowledge of Javascript to use KeystoneJS, as well as familiarity with basics such as database concepts, and using node / npm etc.
3. In the guide we'll also be using [Pug](pugjs.org/) for our view templates and [LESS](lesscss.org/) for our CSS templates. In your own project you can use any template language you like; see [using other template languages](/#using-other-template-languages)TKTKTKTKT (below) for more information.

## Production vs. Development

Keystone applies different settings in production and development modes. The environment will default to development, so you should set the `NODE_ENV` environment variable to `production` on your production servers for better performance.

Your app can detect which environment it is running in by calling `keystone.get('env')`.

If you want to get up and running quickly, check out getting started with our [yeoman generator](/guides/yo-generator).

We also have a [setting up keystone](/introduction/installation) guide if you want to build or integrate keystone from scratch.
