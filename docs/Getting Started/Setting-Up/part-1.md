# Part 1: Initial Setup

## Introduction

If you want to jump right in to a working Keystone codebase, check out the [Quick Start](/getting-started/yo-generator) guide which walks you through using our generator to get a Keystone codebase up and running quickly.

This Setting Up tutorial will walk you through setting up a project from scratch, including introducing and configuring the core parts of Keystone.

This guide assumes you are familiar with [using `npm`](https://docs.npmjs.com/getting-started/what-is-npm) to install packages and JavaScript as a programming language.

We're going to be tackling setting up from scratch in four parts:

 - **Part 1: Initial Setup** (the page you are reading) starts with installation and setting up a `keystone.js` file to launch your application.

 - [Part 2: Data Model Setup](/getting-started/setting-up/part-2) walks you through building your first data model.

 - [Part 3: Routing](/getting-started/setting-up/part-3) introduces setting up routes with Keystone to serve website pages.

 - [Part 4: Adding data from a form](/getting-started/setting-up/part-4) demonstrates how to create a `POST` endpoint for submitting data.

Before getting started, make sure you have [Node.js](nodejs.org) and [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community) installed.

## Installation

Start by creating a new directory and then from within it run `npm init`. Follow the prompts to create a default `package.json`.

Next, install Keystone with `npm install --save keystone`.

At this point, you should have a `node_modules` directory and Keystone should have been added to the `package.json`.

##  Initial Setup

Create a new file, `keystone.js`, and you'll be ready to start configuring Keystone.

`keystone.js` file is the launch file for Keystone: it defines general configuration options, initialises Keystone, and starts your application server.

The minimum file we need to start Keystone running is:

```javascript
var keystone = require('keystone');

keystone.init({
  'cookie secret': 'secure string goes here',
});

keystone.start();
```

Your `keystone.js` needs to require `keystone` and then run the `keystone.init()` function to set up Keystone's initial values.

In this example we are only providing a `cookie secret`. Technically this is the only non-default option that is required to launch Keystone, however as you complete this tutorial you will be adding more options. 

Finally, we call `keystone.start()`, which kicks off the Keystone app.

You can now check this runs. Run `node keystone.js` and you should be greeted with:

```sh
------------------------------------------------
KeystoneJS v4.0.0 started:
Keystone is ready on http://0.0.0.0:3000
------------------------------------------------
```

You should get a 404 page. That's expected since there are no pages set up yet.

## Next Steps

This tutorial continues in [Part 2: Data Model Setup](/getting-started/setting-up/part-2), which walks you through setting up your first data model.


## Learn more about:

- [keystone.init](/api/methods/init)
- [keystone.start](/api/methods/start)
- [Keystone Setup Options](/documentation/configuration)
