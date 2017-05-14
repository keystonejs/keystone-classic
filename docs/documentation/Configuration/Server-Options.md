# Web Server Options

The following options control the configuration of your web server and the express app:

<h4 data-primitive-type="String"><code>env</code></h4>

The environment setting to use. The keys **development** and **production** are supported, and this will have an impact on things like caching compiled templates. Defaults to `process.env.NODE_ENV || "development"`.

You should really **set this to `production` for your production servers** using the `NODE_ENV` environment variable. Several other modules expect this convention also.

<h4 data-primitive-type="Number"><code>port</code></h4>

The port to listen for request on. Defaults to `process.env.PORT || 3000`

<h4 data-primitive-type="String"><code>host</code></h4>

The ip address to listen for request on. Defaults to `process.env.IP || '127.0.0.1'`

`port` must be set (either by option or env variable) or the `host` option will be ignored.

<h4 data-primitive-type="String"><code>views</code></h4>

The path to your application's **view templates**. This is required for using the `keystone.View` Class, and will also be set on the express app.

If you're following the [recommended project structure](/getting-started/yo-generator/#project-structure), this should be set to `"/templates/views"`.

<h4 data-primitive-type="String"><code>view engine</code></h4>

The template engine to use by default. Any engine with express support should work. You will need to install any view engine you intend to use in your project

This option is set on the express app ([see docs here](http://expressjs.com/api.html)).

<h4 data-primitive-type="Function"><code>custom engine</code></h4>

If you want to use a custom template engine, set this option to the function that should be used to process your templates.

See Below for an example of how to use the [Swig](https://github.com/paularmstrong/swig) template engine.

<h4 data-primitive-type="Boolean"><code>view cache</code></h4>

This option is passed through to Express, and controls whether compiled view templates are cached between requests. It defaults to `true` in production, or `false` otherwise so there is rarely any reason to set it explicitly.

<h4 data-primitive-type="Object"><code>locals</code></h4>

The default local variables to pass to your view templates. Routes can extend or change local variables by modifying `res.locals`.

<h4 data-primitive-type="String|Array"><code>static</code></h4>

One or more paths to your application's static files. Setting this will include the `serve-static` middleware.

If you're following the [recommended project structure](/getting-started/yo-generator/#project-structure), this should be set to `'public'`.

<h4 data-primitive-type="Object"><code>static options</code></h4>

Optional config options that will be passed to the `serve-static` middleware ([see docs here](https://github.com/expressjs/serve-static)).

<h4 data-primitive-type="String|Array"><code>less</code></h4>

If you want Keystone to automatically compile **.less** files into **.css** files, set this value to the same path as the `static` option.

When this option is set, any requests to a **.css** or **.min.css** file will first check for a **.less** file with the same name, and if one is found, the css file will be generated.

<h4 data-primitive-type="Object"><code>less options</code></h4>

Optional config options that will be passed to the `less` middleware; see [github.com/emberfeather/less.js-middleware](https://github.com/emberfeather/less.js-middleware) for more information.

<h4 data-primitive-type="String|Array"><code>sass</code></h4>

If you want Keystone to automatically compile **.sass** files into **.css** files, set this value to the same path as the `static` option.

When this option is set, any requests to a **.css** or **.min.css** file will first check for a **.sass** file with the same name, and if one is found, the css file will be generated.

> Note that enabling this option requires you to have specified the `node-sass` package as a dependency in your project's `package.json` file; it is not automatically included with Keystone.

<h4 data-primitive-type="Object"><code>sass options</code></h4>

Optional config options that will be passed to the `sass` middleware; see [github.com/sass/node-sass](https://github.com/sass/node-sass) for more information.

<h4 data-primitive-type="String"><code>favicon</code></h4>

The path to your application's favicon. Setting this will include the `serve-favicon` middleware. Should be relative to your project's root.
If you're following the [recommended project structure](/getting-started/yo-generator/#project-structure), this should be set to `"/public/favicon.ico"`.

<h4 data-primitive-type="Boolean"><code>compress</code></h4>

Set this to true to enable HTTP compression. This will include the `compression` middleware ([see docs here](https://github.com/expressjs/compression)).

<h4 data-primitive-type="String"><code>logger</code></h4>

Set this to include the `morgan` middleware. The value will be passed to the middleware initialisation ([see docs here](https://github.com/expressjs/morgan)). Set this to `false` to disable logging altogether. Defaults to `:method :url :status :response-time ms`.

<h4 data-primitive-type="Object"><code>logger options</code></h4>

Optional config options that will be passed to the morgan middleware; see [github.com/expressjs/morgan](https://github.com/expressjs/morgan) for more information.

<h4 data-primitive-type="Boolean"><code>trust proxy</code></h4>

Set this to enable processing of the HTTP request `X-Forwarded-For` header. Extracted IP addresses will be available as the array `req.ips` ([see docs here](http://expressjs.com/en/api.html)).

### Exposes `onHttpServerCreated` event

```javascript
keystone.start({
  onHttpServerCreated: function() {
    var server = keystone.httpServer;
  }
});
```

## HTTPS Web Server Options

There are two ways to implement HTTPS for your KeystoneJS application: either use a web server (e.g. [NGINX](https://nginx.com)) or PAAS (e.g. [Heroku](https://heroku.com)) that handles it for you, or set the following options to use the [https server provided by node.js](https://nodejs.org/api/https.html).

<h4 data-primitive-type="Boolean|String"><code>ssl</code></h4>

Whether to start the SSL Server. Defaults to `false`.

When set to `true`, both http and https servers will be started. If `ssl key` or `ssl cert` are invalid, just the http server will be started.

When set to "only", only the https server will be started. If `ssl key` or `ssl cert` are invalid, KeystoneJS will not start.

<h4 data-primitive-type="String"><code>ssl key</code></h4>

The path to your SSL Key. Should be either absolute or relative to `process.cwd()` (which is usually your project root).

<h4 data-primitive-type="String"><code>ssl cert</code></h4>

The path to your SSL Certificate. Should be either absolute or relative to `process.cwd()` (which is usually your project root).

<h4 data-primitive-type="String"><code>ssl ca</code></h4>

The path to your SSL CA Bundle. Should be either absolute or relative to `process.cwd()` (which is usually your project root).

<h4 data-primitive-type="Number"><code>ssl port</code></h4>

The port to start the SSL Server on. Defaults to `3001`.

<h4 data-primitive-type="String"><code>ssl host</code></h4>

The ip address to listen for request on. Defaults to `process.env.SSL_IP` or the value of the `host` option.

Exposes `onHttpsServerCreated` event during `keystone.start()`

> WARNING: If you intend to enable SSL on your KeystoneJS app, make sure you're using Node.js `0.10.33` or newer. Node versions prior to `0.10.33` are susceptible to the POODLE (Padding Oracle On Downgraded Legacy Encryption) vulnerability, a man-in-the-middle attack that targets `SSLv3` (see [CVE-2014-3566](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-3566)). As of Node version `0.10.33`, the `SSLv2` and `SSLv3` protocols are disabled by default. For more information see the release notes for [Node v0.10.33 (Stable)](https://nodejs.org/en/blog/release/v0.10.33/).

## Unix Socket Web Server Option

Express will listen to a unix socket for connections

<h4 data-primitive-type="String"><code>unix socket</code></h4>

Path to a writable unix socket. Should be either absolute or relative to `process.cwd()` (which is usually your project root). File will be removed first if present.

When set http and https servers are ignored.

Exposes `onSocketServerCreated` event during `keystone.start()`
