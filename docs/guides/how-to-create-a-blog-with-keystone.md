# How to create a blog with Keystone

One way to get acquainted with Keystone is to build a simple blog with it.
Here's how you can do it:

## Install prerequisites

Before you begin, make sure you have [Node.js](http://nodejs.org/download) 0.10+ and [MongoDB](http://www.mongodb.org/downloads) v2.4+ installed.

## Use the generator

Build a skeleton of your blog using the [Yeoman](http://yeoman.io/) generator.

Install the generator by running the following command in your root directory:

```sh
npm install -g generator-keystone
```

Then create your blog folder and navigate to it:

```sh
mkdir my-blog
cd my-blog
```

Now run the generator like so:

```sh
yo keystone
```

The generator will ask a couple of questions about the configuration.
Go ahead and select the default options.
In this guide, we will use `jade` for templates, and `less` as a CSS pre-processor.

Once you've selected your requirements, the generator will prepare the skeleton of your app, configure the files and install npm dependencies as required.

## Run it for the first time!

Now you can navigate to your project folder and run your app:

```sh
cd my-blog
node keystone
```

You can now go to your browser and check out your new project on port 3000 (open http://localhost:3000).
