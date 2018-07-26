# Part 1: Initial Setup

## Introduction

If you want to jump right in to a working Keystone codebase, check out our [quick start guide](/getting-started/yo-generator), which walks you through using our generator to get a Keystone codebase up and running quickly. This tutorial will walk you through setting up a project, looking at what the core parts of Keystone are and how to set them up.

This guide assumes you are familiar with using npm to install packages, and javascript as a language.

We're going to be tackling this in three parts.

Part 1 (this one here) will focus on installation and setting up our `keystone.js` file, which launch our app.

[Part 2](/getting-started/setting-up/part-2) will detail building Keystone models and setting up your database.

[Part 3](/getting-started/setting-up/part-3) will go through setting up routes with Keystone to serve both database information as well as website pages.

[Part 4](/getting-started/setting-up/part-4) will get a us a `POST` endpoint which we can use to post data to.

Before we start, make sure you have [node](nodejs.org) and [mongo](https://www.mongodb.com/download-center?jmp=nav#community) installed.

## Installation
Start by creating a new directory and then from within it run `npm init`. This will set us up with a `package.json` for you with the ability to set up some default options.

Next, install Keystone with `npm install --save keystone`.

At this point, we should have a `node_modules` directory and Keystone should have been added to the `package.json`.

##  Initial Setup

Create a new file, `keystone.js` and we're ready to start configuring Keystone.

Your `keystone.js` file is the launch file for Keystone, which will connect Keystone to your database, start the database connection, and start your server running. This is where we will be adding configuration options to Keystone as well, which allow us to change how Keystone is running.

The minimum file we need to start Keystone running is:

```javascript
var keystone = require('Keystone');

keystone.init({
  'cookie secret': 'secure string goes here',
});

keystone.start();
```

First we require Keystone, then we run `keystone.init()`. This function sets up Keystone's initial starting values. Here we are only providing it a cookie secret, however as we build up our application we are going to come back and add more options here. If you want to check out the full list of options, you can find them [here](/documentation/configuration).

A `cookie secret` is the only option that is technically required to launch Keystone, however we'll be fleshing this out as we complete our setup.

Finally, we call `keystone.start()`, which kicks off our Keystone app.

We can now check this runs. Run `node keystone.js` and you should be greeted with:

```sh
------------------------------------------------
KeystoneJS Started:
Keystone is ready on http://0.0.0.0:3000
------------------------------------------------
```

You should get a 404 page. That's ok! That will be resolved in [part 3](/getting-started/setting-up/part-3) of this guide. In [Part 2](/getting-started/setting-up/part-2) we are going to focus on getting the database connected, and the admin UI up and running. You can do these two in either order.

## Next Steps
Check out [part 2](/getting-started/setting-up/part-2) of this guide, which walks you through setting up your database, or if you want to read more about any of the parts we set up, you can check out these links:


## Learn more about:

- [keystone.init](/api/methods/init)
- [keystone.start](/api/methods/start)
- [keystone setup configuration](/documentation/configuration)
