# Part 1: Initial Setup

## Introduction

If you want to jump right in to a working keystone codebase, check out our [quick start guide](/getting-started/yo-generator), which walks you through using our generator to get a keystone codebase up and running quickly. This tutorial will walk you through setting up a project, looking at what the core parts of keystone are and how to set them up.

This guide assumes you are familiar with using npm to install packages, and javascript as a language.

We're going to be tackling this in three parts.

Part 1 (this one here) will focus on installation and setting up our `keystone.js` file, which launch our app.

[Part 2](/getting-started/setting-up/part-2) will detail building keystone models and setting up your database.

[Part 3](/getting-started/setting-up/part-3) will go through setting up routes with keystone to serve both database information as well as website pages.

[Part 4](/getting-started/setting-up/part-4) will get a us a `POST` endpoint which we can use to post data to.

Before we start, make sure you have [node](nodejs.org) and [mongo](https://www.mongodb.com/download-center?jmp=nav#community) installed.

## Installation
Start by creating a new directory and then from within it run `npm init`. This will set us up with a `package.json` for you with the ability to set up some default options.

Next, install keystone with `npm install --save keystone`.

At this point, we should have a `node_modules` directory and keystone should have been added to the `package.json`.

##  Initial Setup

Create a new file, `keystone.js` and we're ready to start configuring keystone.

Your `keystone.js` file is the launch file for keystone, which will connect keystone to your database, start both the database connection, and start your server running. This is where we will be adding configuration options to keystone as well, which allow us to change how keystone is running.

The minimum file we need to start keystone running is:

```javascript
var keystone = require('keystone');

keystone.init({
  'cookie secret': 'secure string goes here',
});

keystone.start();
```

First we require keystone, then we run `keystone.init()`. This function sets up keystone's initial starting values. Here we are only providing it a cookie secret, however as we build up our application we are going to come back and add more options here. If you want to check out the full list of options, you can find them [here](/documentation/configuration).

A `cookie secret` is the only option that is technically required to launch keystone, however we'll be fleshing this out as we complete our setup.

Finally, we call `keystone.start()`, which kicks off our keystone app.

We can now check this runs. Run `node keystone.js` and you should be greeted with:

```sh
------------------------------------------------
KeystoneJS Started:
Keystone is ready on http://0.0.0.0:3000
------------------------------------------------
```

Unfortunately all that's there is a 404 error page. We're going to solve that in [part 3](/getting-started/setting-up/part-3). In [Part 2](/getting-started/setting-up/part-2) we are going to focus on getting the database connected, and the admin UI up and running. You can do these two in either order.

## Learn more about:

- [keystone.init](/api/methods/init)
- [keystone.start](/api/methods/start)
- [keystone setup configuration](/documentation/configuration)
