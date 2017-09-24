# How to create a blog with Keystone

In this guide we will walk you through building a simple blog with
Keystone based on the free
[Bootstrap-clean-blog](https://blackrockdigital.github.io/startbootstrap-clean-blog/)
theme.  Our blog will have 3 page templates; an index page with the blog feed,
a single post page, and an 'About us' page.  See the final blog's source code
[here](https://github.com/xyzteam2016/xyzcodeblog).

## Install prerequisites

Before you begin, make sure you have
[Node.js](http://nodejs.org/download) 0.10+ and
[MongoDB](http://www.mongodb.org/downloads) v2.4+ installed.

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
Go ahead and select the default options. Say `Y` when generator asks you
if want you include a `Blog`.  In this guide, we will use `pug`
templating engine, and `less` as a CSS pre-processor.

Once you've selected your requirements, the generator will prepare the
skeleton of your app, configure the files and install npm dependencies
as required.

## Run it for the first time!

Now you can navigate to your project folder and run your app:

```sh
cd my-blog
node keystone
```

You can now go to your browser and check out your new project on port
3000 (open http://localhost:3000).

## Changing blog styles and templates

After you run http://localhost:3000 for the first time, you can see the default blog template with default styles. Now it is time to make our blog look like [Bootstrap-clean-blog](https://blackrockdigital.github.io/startbootstrap-clean-blog/) theme. Download theme's [source files](https://github.com/BlackrockDigital/startbootstrap-clean-blog/archive/gh-pages.zip)

### Adding .less files

By default, Boostrap is already included with Keystone, so we would only have to add a few .less files. Copy contents of Boostrap theme's `less` folder, go to `public/styles/styles/site` and replace existing files with theme's files. Do not forget to `@import` correct .less files in `site.less`. Now re-run `node keystone` to recompile css.

### Editing templates

First, let's re-build header and footer. Open `templates/layouts/default.pug` file which contains template's wrapper. Now by following Bootstrap theme's `index.html`, add fonts, extra navigation elements and theme's classes using Jade. If you are not familiar with Jade (recently renamed to pug), refer to the [official documentation](https://pugjs.org/api/getting-started.html).

Blog and post templates are a bit more tricky to modify. When you open `templates/views/blog.pug`, you will see a mixin which renders a feed of the latest posts where each post has title, brief, image (if it exists) and meta information. Existing `blog.pug` template already contains most of this elements. Let's add missing classes and post's brief by following theme's `index.html` file.

In KeystoneJS, your data schema and models are controlled by [Lists](/list). In our case, `Post` is a [List](/list), and we want to pull relevant data from its [fields](/api/field) or specify it's [options](/api/field/options) or [methods](/documentation/database/#underscore-methods). This way, if we want to access post field data inside mixin, we will use the following syntax: `post.fieldname.subfieldname`. For example, to add post's brief, we will write `post.content.brief`. Similarly, if we want to check if image exists, we will access post image `exists` option, like this `if post.image.exists`, and if it results to true, we show a post's image scaled to fit within the specified width and height, like that `img(src=post._.image.fit(800,800))` using image's `fit` underscore method. For the full list of available fields and their options and methods, refer to (KeystoneJS documentation)[http://keystonejs.com/docs/database/]. Single post `post.pug` template can be modified in exactly same way as `blog.pug` file. The only difference is, in order to access field's data inside `post` template, you need to use `data.listname.fieldname.subfieldname` syntax.

### Creating Pages

By default, there is no Page `Model` shipped with default Keystone project. Since we want to have 'About us' page on our blog, let's go ahead and create it.

1) Create a new `Page.js` file in `models` folder. Since it is very similar to post data model, you can copy-paste contents of `Post.js` and use it as a template changing all occurrences of `Post` to `Page`. New `Page` model doesn't require so many fields as `Post` model, it would be enough to add the following fields:

```javascript
Page.add({
  title: { type: String, required: true },
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  image: { type: Types.CloudinaryImage },
  content: {
    brief: { type: Types.Html, wysiwyg: true, height: 150 },
    extended: { type: Types.Html, wysiwyg: true, height: 400 },
  },
});
```

As the last step, specify which fields to display in `keystone/pages` in Admin UI where all your pages will be listed. In our case we only want to display page title and state, and we set column width to 20%. `Page.defaultColumns = 'title, state|20%';` Now run `node keystone` and go to `http://localhost:3000/keystone/pages` to see our brand new `Page` model in action. Now create a new page called 'About'.

2) Next step would be to add a `view` for pages. Let's use `post.js` as a template. Duplicate it and rename it to `page.js`. Go to `routes/views`, duplicate `post.js` to use as a template and rename it to `page.js`. Let's set `locals` to `pages` this way: `locals.section = 'pages';`, so our page URLs will look like following `http://localhost:3000/pages/pagename`. We can also remove post related code, like `populate('author categories')` since we don't have `author` field in our `Page` model.

3) Now let's define a new route for page. Open `routes/index.js` file, navigate to 'Setup Route Bindings' section and add `app.get('/pages/:page', routes.views.page);` line.

4) Now we are ready to add a template for our page. Go to `templates/views`, create `page.pug` file and copy-paste `post.pug` contents into it. You can access `page` fields and options similar way by using `data.list.fieldname.subfieldname` syntax. Remove post-only related code, and we are all set to move to the last step.

5) Add 'About' page link to navigation. Go to `routes/middleware.js` and add a new line to `res.locals.navLinks`

```javascript
res.locals.navLinks = [
  { label: 'About', key: 'about', href: '/pages/page/about' }, // adding About to blog navigation
  { label: 'Blog', key: 'blog', href: '/blog' },
];
```

Last but not least, you may want to add `Pages` to Admin UI top navigation for easy access. To do so, open `keystone.js` file located in the root of your project and add a new route to `keystone.set(nav)`

```javascript
keystone.set('nav', {
  posts: ['posts', 'post-categories'],
  users: 'users',
  pages: 'pages', // adding pages to Admin UI nav
});
```

Re-run `node keystone` and celebrate your new blog ready to go live.

## Deploy to Heroku

Your blog is now running nicely on your local machine, which is good, but it would be better to show it to the world. Let's deploy it to Heroku!

First of all, head over to https://www.heroku.com/ and sign up for a free account.
Then, download the [Heroku Command Line Interface](https://devcenter.heroku.com/articles/heroku-command-line#download-and-install).

If you want, you can take a [crash course](https://devcenter.heroku.com/articles/getting-started-with-nodejs) on how to deploy a node.js app, to have a head start.

Now, if you are ready, navigate to your project folder, initialize the git repository and make the initial commit:

```sh
git init
git add .
git commit -m "Initial commit"
```

Login to Heroku and create your app:

```sh
heroku login
heroku create my-blog
```

If you run the `heroku create` command without the name parameter, heroku will assign a random name to your app and you will be able to change this later, if you wish.
The command will also automatically add a git remote `heroku`.

If you want to use an existing git repository, you can add it by running the command:

```sh
heroku git:remote -a my-blog
```

Or you can rename it by passing `-r my-best-blog`.

Now we are going to configure the environment variables.
Open the `.env` file in the root directory of your project. In case you accepted the default options in the Yeoman generator, then the file contains the test values. You may register for your own Cloudinary and Mandrill accounts and change these to your own keys, if you like.

Now that we are deploying the app, we need to set these variables using Heroku CLI.

Run `heroku config:set` with the variables from the `.env` file as parameters:

```sh
heroku config:set MANDRILL_API_KEY=<your-mandrill-api-key>
heroku config:set CLOUDINARY_URL=<your-cloudinary-url>
heroku config:set COOKIE_SECRET==<your-cookie-secret>
```

The last piece of set up is adding the MongoDB add-on, which will handle the database connection.

```sh
heroku addons:create mongolab
```

This automatically created another config variable called `MONGODB_URI`. However, Keystone needs it to be called `MONGOLAB_URI`. To fix this, go to your project in your Heroku [dashboard](https://dashboard.heroku.com/), open the Settings tab and rename the variable to `MONGOLAB_URI`

Alright, now we're all ready to deploy!
Push your files:

```sh
git push heroku master
```

And open your app in your browser:

```sh
heroku open
```

Tada! There we have it: your app is live on Heroku!
