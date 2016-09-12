# How to create a blog with Keystone

One of the most common projects you can do with Keystone is a blog.
In this guide we will walk you through building a simple blog based on free [Bootstrap-clean-blog](https://blackrockdigital.github.io/startbootstrap-clean-blog/) theme.
See the final blog's source code [here](https://github.com/xyzteam2016/xyzcodeblog).

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
Go ahead and select the default options. Say `Y` when generator asks you if want you include a `Blog`.
In this guide, we will use `jade` templating engine, and `less` as a CSS pre-processor.

Once you've selected your requirements, the generator will prepare the skeleton of your app, configure the files and install npm dependencies as required.

## Run it for the first time!

Now you can navigate to your project folder and run your app:

```sh
cd my-blog
node keystone
```

You can now go to your browser and check out your new project on port 3000 (open http://localhost:3000).

## Changing blog styles and templates

After you run http://localhost:3000 for the first time, you can see the default blog template with default styles. Now it is time to make our blog look like [Bootstrap-clean-blog](https://blackrockdigital.github.io/startbootstrap-clean-blog/) theme. Download theme's [source files](https://github.com/BlackrockDigital/startbootstrap-clean-blog/archive/gh-pages.zip)

### Adding .less files

By default, Boostrap is already included with Keystone, so we would only have to add a few .less files. Copy contents of Boostrap theme's `less` folder, go to `public/styles/styles/site` and replace existing files with theme's files. Do not forget to `@import` correct .less files in `site.less`. Now re-run `node keystone` to recompile css.

### Editing templates

First, let's re-build header and footer. Open `templates/layouts/default.jade` file which contains template's wrapper. Now by following Bootstrap theme's `index.html`, add fonts, extra navigation elements and theme's classes using Jade. If you are not familiar with Jade (recently renamed to pug), refer to the [official documentation](https://pugjs.org/api/getting-started.html).

Blog and post templates are a bit more tricky to modify. When you open `templates/views/blog.jade`, you will see a mixin which renders a feed of the latest posts where each post has title, brief, image (if it exists) and meta information. Existing `blog.jade` template already contains most of this elements. Let's add missing classes and post's brief by following theme's `index.html` file.

In KeystoneJS, your data schema and models are controlled by [Lists](http://keystonejs.com/docs/database/). In our case, `Post` is a `List`, and we want to pull relevant data from its [fields](http://keystonejs.com/docs/database/#fields) or specify it's [options](http://keystonejs.com/docs/database/#fields-options). This way, if we want to access post's field's data, we will use the following syntax: `post.fieldname.subfieldname`. For example, to add post's brief, we will add `post.content.brief`
