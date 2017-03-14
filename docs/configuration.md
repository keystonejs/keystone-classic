---
title: Keystone Setup Options
---

## Setting Options

The options for KeystoneJS cover a range of behaviours, from how the express app is configured to enabling features and authentication options for integrated services.

There are three ways to set options:

- Passing a `{ key: 'value' }` configuration `Object` to the [keystone.init(options)](/api/init) method
- Calling [keystone.set('key', 'value')](/api/set)
- Setting environment variables in `process.env`. Only some options support this (noted below).

If you want to keep secret keys and configuration out of your codebase (especially important for open source projects, or projects where not all developers should have access to production config settings) the [dotenv](npmjs.org/package/dotenv) module makes this very easy to manage.

## Project Options

The following options control the branding, navigation and default export settings of the KeystoneJS application in the Admin UI:

`name` String
: The name of the KeystoneJS application

`brand` String
: Displayed in the top left hand corner of the Admin UI

`module root` String
: This setting tells Keystone the root path of your app. By default, `module root` points to the path of the first script that required Keystone within your app. This default may be undesireable at times.
Setting `module root` allows you to specify a custom root path for your app. Overriding the default `module root` may be useful, for example, when unit testing your app.
`module root` is used by Keystone's `.getPath()` method to resolve/expand the paths of the `views`, `favicon`, `extensions`, `ssl cert`, `ssl key`, `ssl ca`, `emails`, and `updates` settings.
When setting a custom `module root` you may use either an absolute or a relative path.
> NOTE
> If a relative path is used, it will be considered relative to the location of the script from which the setting was made.

`frame guard` String/Boolean
: This settings tells Keystone how to handle `iframe` tags. It does this by setting the response `X-Frame-Options` header. This header is used to protect against "ClickJacking" attacks.
The default setting is `sameorigin`.
Valid options are:
- `"sameorigin"` allows requests from iframe tags that originate from the same server
- `"deny"` denies requests form all iframe tags, regardless of origin
- `true` (same as "deny" )
- `false` disables frame guard

`nav` Object
: An object that specifies the navigation structure for the Admin UI. Create a key for each section that should be visible in the primary navigation. Each key's value can be a single list path (as is seen in the URL when you view a list) or an array of list paths. When an array is used, secondary navigation is rendered in the Admin UI.
The nav is also used to generate the links on the Admin UI home page; any lists that are registered but not included in the `nav` will be grouped at the bottom of the screen under the 'Other' heading.

**Custom Navigation Example**
If you had `User`, `Post` and `PostCategory` models, you could group the posts and post categories into a **Content** navigation item like this:
```
keystone.set('nav', {
    'users': 'users',
    'content': ['posts', 'post-categories']
});
```
`csv field delimiter` String
:	Allow you to choose a custom field delimiter to be used for CSV export instead of the default comma.

`app` Object
:	Instance of Express to be used instead of the default instance.

`mongoose` Object
:	Instance of Mongoose to be used instead of the default instance.
> NOTE
> The `app` and `mongoose` options replace the functionality of the `keystone.connect()` method which is now deprecated. Due to changes in Express 4, `keystone.connect()` no longer works as expected.

## Web Server Options

The following options control the configuration of your web server and the express app:


`env` String
: The environment setting to use. The keys **development** and **production** are supported, and this will have an impact on things like caching compiled templates. Defaults to `process.env.NODE_ENV || "development"`.
You should really **set this to `production` for your production servers** using the `NODE_ENV` environment variable. Several other modules expect this convention also.

`port` Number
: The port to listen for request on. Defaults to `process.env.PORT || 3000`

`host` String
: The ip address to listen for request on. Defaults to `process.env.IP || '127.0.0.1'`
`port` must be set (either by option or env variable) or the `host` option will be ignored.

`views` String
: The path to your application's **view templates**. This is required for using the `keystone.View` Class, and will also be set on the express app.
If you're following the [recommended project structure](/guides/getting-started/#project-structure), this should be set to `"/templates/views"`.

`view engine` String
: The template engine to use by default. Any engine with express support should work. You will need to install any view engine you intend to use in your project
This option is set on the express app ([see docs here](expressjs.com/api.html)).

`custom engine` Function
: If you want to use a custom template engine, set this option to the function that should be used to process your templates.
[See below](/configuration/#alternative-view-engines) for an example of how to use the [Swig](https://github.com/paularmstrong/swig) template engine.

`view cache` Boolean
: This option is passed through to Express, and controls whether compiled view templates are cached between requests.
It defaults to `true` in production, or `false` otherwise so there is rarely any reason to set it explicitly.

`locals` Object
: The default local variables to pass to your view templates.
Routes can extend or change local variables by modifying `res.locals`.

`static` String or Array
: One or more paths to your application's static files. Setting this will include the `serve-static` middleware.
If you're following the [recommended project structure](/guides/getting-started/#project-structure), this should be set to `'public'`.

`static options` Object
: Optional config options that will be passed to the `serve-static` middleware ([see docs here](github.com/expressjs/serve-static)).

`less` String or Array
: If you want Keystone to automatically compile **.less** files into **.css** files, set this value to the same path as the `static` option.
When this option is set, any requests to a **.css** or **.min.css** file will first check for a **.less** file with the same name, and if one is found, the css file will be generated.

`less options` Object
: Optional config options that will be passed to the `less` middleware; see [github.com/emberfeather/less.js-middleware](github.com/emberfeather/less.js-middleware) for more information.

`sass` String or Array
: If you want Keystone to automatically compile **.sass** files into **.css** files, set this value to the same path as the `static` option.
When this option is set, any requests to a **.css** or **.min.css** file will first check for a **.sass** file with the same name, and if one is found, the css file will be generated.
> NOTE
> Note that enabling this option requires you to have specified the `node-sass` package as a dependency in your project's `package.json` file; it is not automatically included with Keystone.

`sass options` Object
: Optional config options that will be passed to the `sass` middleware; see [github.com/sass/node-sass](github.com/sass/node-sass) for more information.

`favicon` String
: The path to your application's favicon. Setting this will include the `serve-favicon` middleware. Should be relative to your project's root.
If you're following the [recommended project structure](/guides/getting-started/#project-structure), this should be set to `"/public/favicon.ico"`.

`compress` Boolean
: Set this to true to enable HTTP compression. This will include the `compression` middleware ([see docs here](github.com/expressjs/compression)).

`logger` String
: Set this to include the `morgan` middleware. The value will be passed to the middleware initialisation ([see docs here](github.com/expressjs/morgan)). Set this to `false` to disable logging altogether. Defaults to `:method :url :status :response-time ms`.

`logger options` Object
: Optional config options that will be passed to the morgan middleware; see [github.com/expressjs/morgan](github.com/expressjs/morgan) for more information.

`trust proxy` Boolean
: Set this to enable processing of the HTTP request `X-Forwarded-For` header. Extracted IP addresses will be available as the array `req.ips` ([see docs here](expressjs.com/en/api.html)).

### Alternative View Engines

By default, Keystone uses the **Jade** template engine for your views. Here's how you would set up a different engine, e.g. **Swig**.

```
var swig = require('swig');
keystone.set('view engine', 'swig');
keystone.set('custom engine', swig.renderFile);
```

### Exposes `onHttpServerCreated` event
```
keystone.start({
    onHttpServerCreated: function() {
      var server = keystone.httpServer;
    }
});
```

## HTTPS Web Server Options

There are two ways to implement HTTPS for your KeystoneJS application: either use a web server (e.g. [NGINX](nginx.com)) or PAAS (e.g. [Heroku](heroku.com)) that handles it for you, or set the following options to use the [https server provided by node.js](https://nodejs.org/api/https.html).


`ssl` Boolean or String
: Whether to start the SSL Server. Defaults to `false`.
When set to `true`, both http and https servers will be started. If `ssl key` or `ssl cert` are invalid, just the http server will be started.
When set to "only", only the https server will be started. If `ssl key` or `ssl cert` are invalid, KeystoneJS will not start.

`ssl key Path`
: The path to your SSL Key. Should be either absolute or relative to `process.cwd()` (which is usually your project root).

`ssl cert` Path
: The path to your SSL Certificate. Should be either absolute or relative to `process.cwd()` (which is usually your project root).

`ssl ca` Path
: The path to your SSL CA Bundle. Should be either absolute or relative to `process.cwd()` (which is usually your project root).

`ssl port` Number
: The port to start the SSL Server on. Defaults to `3001`.

`ssl host` String
The ip address to listen for request on. Defaults to `process.env.SSL_IP` or the value of the `host` option.

Exposes `onHttpsServerCreated` event during `keystone.start()`

> NOTE
> WARNING: If you intend to enable SSL on your KeystoneJS app, make sure you're using Node.js `0.10.33` or newer. Node versions prior to `0.10.33` are susceptible to the POODLE (Padding Oracle On Downgraded Legacy Encryption) vulnerability, a man-in-the-middle attack that targets `SSLv3` (see [CVE-2014-3566](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-3566)). As of Node version `0.10.33`, the `SSLv2` and `SSLv3` protocols are disabled by default. For more information see the release notes for [Node v0.10.33 (Stable)](https://nodejs.org/en/blog/release/v0.10.33/).

## Unix Socket Web Server Option

Express will listen to a unix socket for connections

`unix socket` String
Path to a writable unix socket. Should be either absolute or relative to `process.cwd()` (which is usually your project root). File will be removed first if present.
When set http and https servers are ignored.

Exposes `onSocketServerCreated` event during `keystone.start()`

## Database and User Auth Options

The following options control your database configuration and user models / authentication:

### `mongo` `String`
: The url for your MongoDB connection.
You should typically set this to `process.env.MONGO_URI || "mongodb://localhost/your-db"`

### `model prefix` `String`
: A prefix to apply to all the mongodb collections used by the models.

### `auth` `Mixed`
: Whether to enable built-in auth for Keystone's Admin UI, or a custom function to use to authenticate users.
When this is set to `false` (or not defined), Keystone's Admin UI will be open to the public (so set it!)
If using a custom function, it should follow the standard for express middleware of `function(req, res, next)`. If a user is not logged in or should not access Keystone's Admin UI, use `res.redirect()` to redirect them - otherwise call the `next` callback to enable access.

### `user model` `String`
: The key of the Keystone List for users, **required** if `auth` is set to true
Typically this would be set to User.

### `cookie secret` `String`
The encryption key to use for your cookies. Passed to Express's cookie parser.
It's a really good idea to set this to a long, random string.

### `session store` `String or Function`
Set this to mongo to use your MongoDB database to persist session data.
By default, Keystone will use the in-memory session store provided by Express, which should only be used in development because it does not scale past a single process, and leaks memory over time.
Valid options are:
- `mongo` (or `connect-mongo`)
- `connect-mongostore` (supports replica sets, but requires explicit configuration - see below)
- `connect-redis`
- `function(expressSession){ ... }`. You may specify a custom express-session store implementation by setting the `session store` property to a function that returns an express-session store implementation (see example below).
> NOTE
> Session store packages are not bundled with Keystone, so make sure you explicitly add the selected session store to your project's package.json.
> NOTE
> The session configuration passed to Express is available via keystone.get('express session')

**Example using custom express-session store**

```
var keystone = require('keystone'),
    ConnectMemcached = require('connect-memcached')

keystone.init({
  //...
  'session store': function(session){
    return new (ConnectMemcached(session))({
      hosts: [
        'localhost:11211'
      ]
    });
  }
});
```

`session store options` Object
: This option allows you to override the default session store configuration, and is passed to the session store package.
It is required when using the `connect-mongostore` store.
**Example for connect-mongostore**

```
"sessionStore": {
  "db": {
    "name": "myDb",
    "servers": [
      { "host": "192.168.1.100", "port": 28001 },
      { "host": "192.168.1.100", "port": 28002 },
      { "host": "192.168.1.101", "port": 27017 }
    ]
  }
}
```

**Example for connect-redis**

```
"sessionStore": {
  "host": "", // Redis server hostname
  "port": "", // Redis server port
  "ttl": "", // Redis session TTL in seconds
  "db": "", // Database index to use
  "pass": "", // Password for Redis authentication
  "prefix": "", // Key prefix defaulting to "sess:"
  "url": "", // e.g. redis://user:pass@host:port/db
}
```

> NOTE
> The session options are made available via `keystone.get('session options')`

`back url` String
: `href` to use for the 'back to (site name)' link in the header of the Admin UI
Defaults to `/`

`signin url` String
`href` to bounce visitors to when they fail the default auth check (e.g. not signed in)
Defaults to `/keystone/signin`, only used when `auth` is set to `true`

`signin redirect` String
: `href` to bounce visitors to after they successfully sign in via the built-in signin route
Defaults to `/keystone`

`signout url` String
: `href` for the signout link in the top right of the UI
Defaults to `/keystone/signout` if `auth` is set to `true`

`signout redirect` String
: `href` to bounce visitors to after they successfully sign out via the built-in sign out route
Defaults to `/keystone`

For more information about setting up and using database models with Keystone, see the [database guide](/database/).

## Admin UI Options

The following options control some ui options for the Admin backend:

`wysiwyg images` Boolean
: Adds an image button which enables including images from other URLS in your WYSIWYG Editor.

`wysiwyg cloudinary images` Boolean
: Adds an image upload button and enables cloudinary image uploads directly in your WYSIWYG Editor.

`wysiwyg additional buttons` String
: Allows to add additional extra functionality buttons such as blockquote.
A complete list of available buttons can be found at: [http://www.tinymce.com/wiki.php/Controls](http://www.tinymce.com/wiki.php/Controls)

`wysiwyg additional plugins` String
: Allows for additional plugins to be activated which can be found at: [http://www.tinymce.com/wiki.php/Plugins](http://www.tinymce.com/wiki.php/Plugins)

`wysiwyg additional options` Object
: Allows for additional TinyMCE options, such as `{ menubar: true }` to be modified.

`wysiwyg override toolbar` Boolean
: This will remove the default set of buttons for wysiwyg mode. Use this with `wysiwyg additional buttons` and `wysiwyg additional plugins`. Defaults to `false`.

`wysiwyg menubar` Boolean
: Show the menubar for wysiwyg editor. Defaults to `false`.
See [http://www.tinymce.com/wiki.php/Configuration:menubar](http://www.tinymce.com/wiki.php/Configuration:menubar) for more details.

`wysiwyg importcss` String
: Sets the `content_css` and configures the `importcss` plugin for TinyMCE.
See [http://www.tinymce.com/wiki.php/Configuration:content_css](http://www.tinymce.com/wiki.php/Configuration:content_css) for more details.

`wysiwyg skin` String
: Allow you to change the TinyMCE skin. Defaults to `keystone`.
See [http://www.tinymce.com/wiki.php/Configuration:skin](http://www.tinymce.com/wiki.php/Configuration:skin) for more details.
**Example using wysiwyg options**
```
keystone.init({
'wysiwyg override toolbar': false,
'wysiwyg menubar': true,
'wysiwyg skin': 'lightgray',
'wysiwyg additional buttons': 'searchreplace visualchars,'
 + ' charmap ltr rtl pagebreak paste, forecolor backcolor,'
 +' emoticons media, preview print ',
'wysiwyg additional plugins': 'example, table, advlist, anchor,'
 + ' autolink, autosave, bbcode, charmap, contextmenu, '
 + ' directionality, emoticons, fullpage, hr, media, pagebreak,'
 + ' paste, preview, print, searchreplace, textcolor,'
 + ' visualblocks, visualchars, wordcount',
});
```

# Services

## Google Analytics

Keystone has support for Google Analytics tracking in the Admin UI. To enable tracking, set the following configuration options:

`ga property` String
Your Google Analytics Property
Will default to `process.env.GA_PROPERTY`

`ga domain` String
Your Google Analytics Domain
Will default to `process.env.GA_DOMAIN`

> NOTE
> Note if you only want to include Google Analytics tracking in the front-end of your project, you should use different variable names from those above.

## Google Maps

Keystone's [Location field type](/field/location/) supports integration with the [Google Maps API](www.morethanamap.com/) to auto-improve values (including discovering latitude and longitude) via the [Places Autocomplete API](developers.google.com/places/web-service/autocomplete).

To enable these features, [obtain an API Key from Google](https://code.google.com/apis/console/) and enable the Google Maps v3 and Google Places APIs for it, then set the following options:

`google api key` String
: Your Google API browser key, used to authenticate the Javascript Maps API in the Admin UI.
Will default to `process.env.GOOGLE_BROWSER_KEY`

`google server api key` String
: Your Google API server key, used to authenticate requests to the Maps API from the server.
Will default to `process.env.GOOGLE_SERVER_KEY`

`default region` String
: Optional setting to limit autocomplete results to a specific region.
This option takes a region code, specified as a [IANA language region](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry) subtag.
Can be specified on a per-field basis by setting the `region` option on any `Location` field.
```
keystone.set('google api key', 'your-browser-key');
keystone.set('google server api key', 'your-server-key');
keystone.set('default region', 'au'); // optional, will limit autocomplete results to Australia
```
> NOTE
> Note that the use of the Places Geocoding API is subject to a query limit of 2,500 geolocation requests per day, except with an enterprise license.
> NOTE
> The Places Geocoding API may only be used in conjunction with a Google map; geocoding results without displaying them on a map is prohibited. Please make sure your Keystone app complies with the Google Maps API License.

## Embed.ly

Embed.ly is a service that will parse a url (e.g. Youtube embed link) and return a whole lot of useful information, like the provider name, summary metadata, width and height of videos, as well as a clean link to use for embedding media in your views. They offer a free plan for up to 5,000 urls per month.

The Embedly field type is an easy way to integrate their API with your KeystoneJS app.

To configure KeystoneJS to support the Embed.ly API, simply sign up for an account, get your api key, and set the embedly api key option.

This option will default to the EMBEDLY_API_KEY environment variable if it is set.

```
keystone.set('embedly api key', 'your-key');
```

# Application Updates

Keystone includes an updates framework, which you can enable by setting the `auto update` option to `true`.

Updates provide an easy way to seed your database, transition data when your models change, or run transformation scripts against your database.

Update files should be named using a semantic version followed by an optional key, like `0.0.1-init.js`. The version numbers are used to order the update scripts correctly, while the keys are a nice way to identify what each update does.

Each update file should export a single function, which should accept a single argument - the `next(err)` callback, to be called when the update is complete.

All the update files will be executed (each one waits for the previous update to complete) before the web server is started.

If the `next` callback is receives an error it will be reported to the console, and application initialisation will halt.

You can temporarily disable updates from running in development by setting a `__defer__` property on the exported function to `true`. Any subsequent updates will be skipped, but the application will be started.

Updates are only run once, and each completed update is logged in an `app_updates` collection in your database.

**Update Script Example**
Creates a new admin User

```
var keystone = require('keystone'),
    User = keystone.list('User');

exports = module.exports = function(done) {
    new User.model({
        name: { first: 'Admin', last: 'User' },
        password: 'admin',
        isAdmin: true
    }).save(done);
};
```

# Disabling the Admin UI

You can disable the Admin UI by setting the `headless` option to `true`.

This will allow you to use `keystone.start()` or `keystone.routes(app)` without Keystone creating route bindings for the Admin UI routes under `/keystone`.
