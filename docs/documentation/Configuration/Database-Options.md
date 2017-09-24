# Database and User Auth Options

The following options control your database configuration and user models / authentication:

<h4 data-primitive-type="String"><code>mongo</code></h3.9>

The url for your MongoDB connection.

You should typically set this to `process.env.MONGO_URI || "mongodb://localhost/your-db"`, which will cause it to default to localhost unless a MONGO_URI is explicitly provided in the environment.

<h4 data-primitive-type="String"><code>model prefix</code></h4>

A prefix to apply to all the mongodb collections used by the models.

<h4 data-primitive-type="Mixed"><code>auth</code></h4>

Whether to enable built-in auth for Keystone's Admin UI, or a custom function to use to authenticate users.

When this is set to `false` (or not defined), Keystone's Admin UI will be open to the public (so set it!)

If using a custom function, it should follow the standard for express middleware of `function(req, res, next)`. If a user is not logged in or should not access Keystone's Admin UI, use `res.redirect()` to redirect them - otherwise call the `next` callback to enable access.

<h4 data-primitive-type="String"><code>user model</code></h4>

The key of the Keystone List for users, **required** if `auth` is set to true
Typically this would be set to User.

<h4 data-primitive-type="String"><code>cookie secret</code></h4>

The encryption key to use for your cookies. Passed to Express's cookie parser.

It's a really good idea to set this to a long, random string.

<h4 data-primitive-type="String|Function"><code>session store</code></h4>

Set this to mongo to use your MongoDB database to persist session data.
By default, Keystone will use the in-memory session store provided by Express, which should only be used in development because it does not scale past a single process, and leaks memory over time.

Valid options are:

- `mongo` (or `connect-mongo`)
- `connect-mongostore` (supports replica sets, but requires explicit configuration - see below)
- `connect-redis`
- `function(expressSession){ ... }`. You may specify a custom express-session store implementation by setting the `session store` property to a function that returns an express-session store implementation (see example below).

> Session store packages are not bundled with Keystone, so make sure you explicitly add the selected session store to your project's package.json.

> The session configuration passed to Express is available via keystone.get('express session')

**Example using custom express-session store**

```javascript
var keystone = require('keystone'),
    ConnectMemcached = require('connect-memcached')

keystone.init({
  'session store': function(session){
    return new (ConnectMemcached(session))({
      hosts: [
        'localhost:11211'
      ]
    });
  }
});
```

<h4 data-primitive-type="Object"><code>session store options</code></h4>

This option allows you to override the default session store configuration, and is passed to the session store package.

It is required when using the `connect-mongostore` store.

**Example for connect-mongostore**

```javascript
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

```javascript
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

> The session options are made available via `keystone.get('session options')`

<h4 data-primitive-type="String"><code>back url</code></h4>

A `href` string to use for the 'back to (site name)' link in the header of the Admin UI. Defaults to `/`.

<h4 data-primitive-type="String"><code>signin url</code></h4>

A `href` to bounce visitors to when they fail the default auth check (e.g. not signed in). Defaults to `/keystone/signin`, only used when `auth` is set to `true`/

<h4 data-primitive-type="String"><code>signin redirect</code></h4>

A `href` to bounce visitors to after they successfully sign in via the built-in signin route. Defaults to `/keystone`.

<h4 data-primitive-type="String"><code>signout url</code></h4>

A `href` for the signout link in the top right of the UI. Defaults to `/keystone/signout` if `auth` is set to `true`

<h4 data-primitive-type="String"><code>signout redirect</code></h4>

A `href` to bounce visitors to after they successfully sign out via the built-in sign out route. Defaults to `/keystone`


For more information about setting up and using database models with Keystone, see the [database guide](/database/).
