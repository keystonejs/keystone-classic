var fs = require('fs'),
	path = require('path'),
	http = require('http'),
	https = require('https'),
	_ = require('underscore'),
	express = require('express'),
	async = require('async'),
	jade = require('jade'),
	moment = require('moment'),
	numeral = require('numeral'),
	cloudinary = require('cloudinary'),
	mandrillapi = require('mandrill-api'),
	utils = require('keystone-utils');

var templateCache = {};

var dashes = '\n------------------------------------------------\n';

/**
 * Don't use process.cwd() as it breaks module encapsulation
 * Instead, let's use module.parent if it's present, or the module itself if there is no parent (probably testing keystone directly if that's the case)
 * This way, the consuming app/module can be an embedded node_module and path resolutions will still work
 * (process.cwd() breaks module encapsulation if the consuming app/module is itself a node_module)
 */
var moduleRoot = (function(_rootPath) {
	var parts = _rootPath.split(path.sep);
	parts.pop(); //get rid of /node_modules from the end of the path
	return parts.join(path.sep);
})(module.parent ? module.parent.paths[0] : module.paths[0]);


/**
 * Keystone Class
 *
 * @api public
 */

var Keystone = function() {
	
	this.lists = {};
	this.paths = {};
	this._options = {
		'name': 'Keystone',
		'brand': 'Keystone',
		'compress': true,
		'headless': false,
		'logger': 'dev',
		'auto update': false,
		'model prefix': null
	};
	this._pre = {
		routes: [],
		render: []
	};
	this._redirects = {};
	
	// expose express
	
	this.express = express;
	
	
	// init environment defaults
	
	this.set('env', process.env.NODE_ENV || 'development');
	
	this.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT);
	this.set('host', process.env.HOST || process.env.IP || process.env.OPENSHIFT_NODEJS_IP);
	this.set('listen', process.env.LISTEN);
	
	this.set('ssl', process.env.SSL);
	this.set('ssl port', process.env.SSL_PORT);
	this.set('ssl host', process.env.SSL_HOST || process.env.SSL_IP);
	this.set('ssl key', process.env.SSL_KEY);
	this.set('ssl cert', process.env.SSL_CERT);
	
	this.set('cookie secret', process.env.COOKIE_SECRET);
	this.set('cookie signin', (this.get('env') === 'development') ? true : false);
	
	this.set('embedly api key', process.env.EMBEDLY_API_KEY || process.env.EMBEDLY_APIKEY);
	this.set('mandrill api key', process.env.MANDRILL_API_KEY || process.env.MANDRILL_APIKEY);
	this.set('mandrill username', process.env.MANDRILL_USERNAME);
	this.set('google api key', process.env.GOOGLE_BROWSER_KEY);
	this.set('google server api key', process.env.GOOGLE_SERVER_KEY);
	this.set('ga property', process.env.GA_PROPERTY);
	this.set('ga domain', process.env.GA_DOMAIN);
	this.set('chartbeat property', process.env.CHARTBEAT_PROPERTY);
	this.set('chartbeat domain', process.env.CHARTBEAT_DOMAIN);
	this.set('allowed ip ranges', process.env.ALLOWED_IP_RANGES);
	
	if (process.env.S3_BUCKET && process.env.S3_KEY && process.env.S3_SECRET) {
		this.set('s3 config', { bucket: process.env.S3_BUCKET, key: process.env.S3_KEY, secret: process.env.S3_SECRET, region: process.env.S3_REGION });
	}
	
	if (process.env.AZURE_STORAGE_ACCOUNT && process.env.AZURE_STORAGE_ACCESS_KEY) {
		this.set('azurefile config', { account: process.env.AZURE_STORAGE_ACCOUNT, key: process.env.AZURE_STORAGE_ACCESS_KEY });
	}
	
	if (process.env.CLOUDINARY_URL) {
		// process.env.CLOUDINARY_URL is processed by the cloudinary package when this is set
		this.set('cloudinary config', true);
	}
	
	// Attach core modules
	this.createItems = require('./lib/core/createItems')(this);
	
	// Attach middleware modules
	this.initAPI = require('./lib/middleware/initAPI')(this);
	
};


/**
 * Deprecated options that have been mapped to new keys
 */
var remappedOptions = {
	'signin success': 'signin redirect',
	'signout': 'signout url'
};

/**
 * Sets keystone options
 *
 * ####Example:
 *
 *     keystone.set('user model', 'User') // sets the 'user model' option to `User`
 *
 * @param {String} key
 * @param {String} value
 * @api public
 */
Keystone.prototype.set = function(key, value) {
 	
	if (arguments.length === 1) {
		return this._options[key];
	}
	
	if (remappedOptions[key]) {
		if (this.get('logger')) {
			console.log('\nWarning: the `' + key + '` option has been deprecated. Please use `' + remappedOptions[key] + '` instead.\n\n' +
				'Support for `' + key + '` will be removed in a future version.');
		}
		key = remappedOptions[key];
	}
	
	// handle special settings
	switch (key) {
		case 'cloudinary config':
			if (_.isObject(value)) {
				cloudinary.config(value);
			}
			value = cloudinary.config();
		break;
		case 'mandrill api key':
			if (value) {
				this.mandrillAPI = new mandrillapi.Mandrill(value);
			}
		break;
		case 'auth':
			if (value === true && !this.get('session')) {
				this.set('session', true);
			}
		break;
		case 'nav':
			this.nav = this.initNav(value);
		break;
		case 'mongo':
			if ('string' !== typeof value) {
				if (Array.isArray(value) && (value.length === 2 || value.length === 3)) {
					console.log('\nWarning: using an array for the `mongo` option has been deprecated.\nPlease use a mongodb connection string, e.g. mongodb://localhost/db_name instead.\n\n' +
						'Support for arrays as the `mongo` setting will be removed in a future version.');
					value = (value.length === 2) ? 'mongodb://' + value[0] + '/' + value[1] : 'mongodb://' + value[0] + ':' + value[2] + '/' + value[1];
				} else {
					console.error('\nInvalid Configuration:\nThe `mongo` option must be a mongodb connection string, e.g. mongodb://localhost/db_name\n');
					process.exit(1);
				}
			}
		break;
	}
	
	this._options[key] = value;
	return this;
};


/**
 * Sets multiple keystone options.
 *
 * ####Example:
 *
 *     keystone.set({test: value}) // sets the 'test' option to `value`
 *
 * @param {Object} options
 * @api public
 */

Keystone.prototype.options = function(options) {
	if (!arguments.length)
		return this._options;
	if (utils.isObject(options)) {
		var keys = Object.keys(options),
			i = keys.length,
			k;
		while (i--) {
			k = keys[i];
			this.set(k, options[k]);
		}
	}
	return this._options;
};


/**
 * Gets keystone options
 *
 * ####Example:
 *
 *     keystone.get('test') // returns the 'test' value
 *
 * @param {String} key
 * @method get
 * @api public
 */

Keystone.prototype.get = Keystone.prototype.set;

/**
 * Gets a path option, expanded to include moduleRoot if it is relative
 *
 * ####Example:
 *
 *     keystone.get('test') // returns the 'test' value
 *
 * @param {String} key
 * @method get
 * @api public
 */

Keystone.prototype.getPath = function(key, defaultValue) {
	var pathValue = keystone.get(key) || defaultValue;
	pathValue = ('string' === typeof pathValue && pathValue.substr(0,1) !== path.sep && pathValue.substr(1,2) !== ':\\')
		? path.join(moduleRoot, pathValue)
		: pathValue;
	return pathValue;
};


/**
 * Registers a pre-event handler.
 *
 * Valid events include:
 * - `routes` - calls the function before any routes are matched, after all other middleware
 *
 * @param {String} event
 * @param {Function} function to call
 * @api public
 */

Keystone.prototype.pre = function(event, fn) {
	if (!this._pre[event]) {
		throw new Error('keystone.pre() Error: event ' + event + ' does not exist.');
	}
	this._pre[event].push(fn);
	return this;
};


/**
 * Connects keystone to the application's mongoose instance.
 *
 * ####Example:
 *
 *     var mongoose = require('mongoose');
 *
 *     keystone.connect(mongoose);
 *
 * @param {Object} connections
 * @api public
 */

Keystone.prototype.connect = function() {
	// detect type of each argument
	for (var i = 0; i < arguments.length; i++) {
		if (arguments[i].constructor.name === 'Mongoose') {
			// detected Mongoose
			this.mongoose = arguments[i];
		} else if (arguments[i].name === 'app') {
			// detected Express app
			this.app = arguments[i];
		}
	}
	return this;
};

Keystone.prototype.prefixModel = function (key) {
	var modelPrefix = this.get('model prefix');
	
	if (modelPrefix)
		key = modelPrefix + '_' + key;
	
	return require('mongoose/lib/utils').toCollectionName(key);
}

/**
 * The exports object is an instance of Keystone.
 *
 * @api public
 */

var keystone = module.exports = exports = new Keystone();

// Expose modules and Classes
keystone.utils = utils;
keystone.content = require('./lib/content');
keystone.List = require('./lib/list');
keystone.Field = require('./lib/field');
keystone.Field.Types = require('./lib/fieldTypes');
keystone.View = require('./lib/view');
keystone.Email = require('./lib/email');

var security = keystone.security = {
	csrf: require('./lib/security/csrf')
};


/**
 * Initialises Keystone in encapsulated mode.
 *
 * Creates an Express app and configures it if none has been connected.
 *
 * Also connects to the default mongoose instance if none has been connected.
 *
 * Accepts an options argument.
 *
 * Returns `this` to allow chaining.
 *
 * @param {Object} options
 * @api public
 */

Keystone.prototype.init = function(options) {
	
	this.options(options);
	
	if (!this.app) {
		this.app = express();
	}
	
	if (!this.mongoose) {
		this.connect(require('mongoose'));
	}
	
	return this;
	
};

/**
 * Initialises Keystone's nav
 *
 * @param {Object} nav
 * @api private
 */

Keystone.prototype.initNav = function(sections) {
	
	var nav = {
		sections: [],
		by: {
			list: {},
			section: {}
		}
	};
	
	if (!sections) {
		sections = {};
		nav.flat = true;
		_.each(this.lists, function(list) {
			if (list.get('hidden')) return;
			sections[list.path] = [list.path];
		});
	}
	
	_.each(sections, function(section, key) {
		if ('string' === typeof section) {
			section = [section];
		}
		section = {
			lists: section,
			label: nav.flat ? keystone.list(section[0]).label : utils.keyToLabel(key)
		};
		section.key = key;
		section.lists = _.map(section.lists, function(i) {
			var msg, list = keystone.list(i);
			if (!list) {
				msg = 'Invalid Keystone Option (nav): list ' + i + ' has not been defined.\n';
				throw new Error(msg);
			}
			if (list.get('hidden')) {
				msg = 'Invalid Keystone Option (nav): list ' + i + ' is hidden.\n';
				throw new Error(msg);
			}
			nav.by.list[list.key] = section;
			return list;
		});
		if (section.lists.length) {
			nav.sections.push(section);
			nav.by.section[section.key] = section;
		}
	});
	
	return nav;
};

/**
 * Configures a Keystone app in encapsulated mode, but does not start it.
 *
 * Connects to the database and runs updates and then calls back.
 *
 * This is the code-path to use if you'd like to mount the keystone app as a sub-app in another express application.
 *
 *   var app = express();
 *
 *   //...do your normal express setup stuff, add middleware and routes (but not static content or error handling middleware yet)
 *
 *   keystone.mount('/content', app, function() {
 *     //put your app's static content and error handling middleware here and start your server
 *   });
 *
 * Events are fired during initialisation to allow customisation, including:
 *
 *   - onMount
 *
 * If the events argument is a function, it is assumed to be the mounted event.
 *
 *
 * ####Options:
 *
 * Keystone supports the following options specifically for running in encapsulated mode (with no embedded server):
 *
 *   - name
 *   - port
 *   - views
 *   - view engine
 *   - compress
 *   - favico
 *   - less
 *   - static
 *   - headless
 *   - logger
 *   - cookie secret
 *   - session
 *   - 404
 *   - 500
 *   - routes
 *   - locals
 *   - auto update
 *
 *
 * @api public
 */

Keystone.prototype.mount = function(mountPath, parentApp, events) {
	
	// Validate the express app instance
	
	if (!this.app) {
		console.error('\nKeystoneJS Initialisaton Error:\n\napp must be initialised. Call keystone.init() or keystone.connect(new Express()) first.\n');
		process.exit(1);
	}
	
	var keystone = this,
		app = this.app;
	
	// this.nativeApp indicates keystone has been mounted natively
	// (not as part of a custom middleware stack)
	this.nativeApp = true;
	
	// Initialise the mongo connection url
	
	if (!this.get('mongo')) {
		var dbName = this.get('db name') || utils.slug(this.get('name'));
		var dbUrl = process.env.MONGO_URI || process.env.MONGO_URL || process.env.MONGOLAB_URI || process.env.MONGOLAB_URL || (process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/') + dbName;
		this.set('mongo', dbUrl);
	}
	
	// Initialise and validate session options
	
	if (!this.get('cookie secret')) {
		console.error('\nKeystoneJS Configuration Error:\n\nPlease provide a `cookie secret` value for session encryption.\n');
		process.exit(1);
	}
	
	var sessionOptions = keystone.get('session options');
	
	if (!_.isObject(sessionOptions)) {
		sessionOptions = {};
	}
	
	if (!sessionOptions.key) {
		sessionOptions.key = 'keystone.sid';
	}
	
	sessionOptions.cookieParser = express.cookieParser(this.get('cookie secret'));

	var sessionStore = this.get('session store');

	if (sessionStore) {
		
		var sessionStoreOptions = this.get('session store options') || {};

		// Perform any session store specific configuration or exit on an unsupported session store
		
		switch (sessionStore) {
			
			case 'mongo':
				// default session store for using MongoDB
				sessionStore = 'connect-mongo';
			case 'connect-mongo':
				_.defaults(sessionStoreOptions, {
					collection: 'app_sessions',
					url: this.get('mongo')
				});
				break;

			case 'connect-mongostore':
				_.defaults(sessionStoreOptions, {
					collection: 'app_sessions'
				});
				if (!sessionStoreOptions.db) {
					if (throwSessionOptionsError) {
						console.error(
							'\nERROR: ' + sessionStore + ' requires `session store options` to be set.' +
							'\n' +
							'\nSee http://localhost:8080/docs/configuration#options-database for details.' +
						'\n');
						process.exit(1);
					}
				}
				break;
			
			case 'redis':
				// default session store for using Redis
				sessionStore = 'connect-redis';
			case 'connect-redis':
				break;

			default:
				console.error(
						'\nERROR: unsupported session store ' + sessionStore + '.' +
						'\n' +
						'\nSee http://localhost:8080/docs/configuration#options-database for details.' +
					'\n');
				process.exit(1);
				break;
		}

		// Initialize the session store
		try {
			
			var _SessionStore = require(sessionStore)(express);
			sessionOptions.store = new _SessionStore(sessionStoreOptions);
			
		} catch(e) {
			
			if (e.code == 'MODULE_NOT_FOUND') {
				
				// connect-redis must be explicitly installed @1.4.7, so we special-case it here
				var installName = (sessionStore == 'connect-redis') ? sessionStore + '@1.4.7' : sessionStore;
				
				console.error(
					'\nERROR: ' + sessionStore + ' not found.\n' +
					'\nPlease install ' + sessionStore + ' from npm to use it as a `session store` option.' +
					'\nYou can do this by running "npm install ' + installName + ' --save".' +
				'\n');
				process.exit(1);
				
			} else {
				throw e;
			}
		}
	}

	// expose initialised session options
	
	this.set('session options', sessionOptions);
	
	// wrangle arguments
	
	if (arguments.length === 1) {
		events = arguments[0];
		mountPath = null;
	}
	
	if ('function' === typeof events) {
		events = { onMount: events };
	}
	
	if (!events) events = {};
	
	/* Express sub-app mounting to external app at a mount point (if specified) */
	
	if (mountPath) {
		//fix root-relative keystone urls for assets (gets around having to re-write all the keystone templates)
		parentApp.all(/^\/keystone($|\/*)/, function(req, res, next) {
			req.url = mountPath + req.url;
			next();
		});
		
		parentApp.use(mountPath, app);
	}
	
	/* Keystone's encapsulated Express App Setup */
	
	// Allow usage of custom view engines
	
	if (this.get('custom engine')) {
		app.engine(this.get('view engine'), this.get('custom engine'));
	}
	
	// Set location of view templates and view engine
	
	app.set('views', this.getPath('views') || path.sep + 'views');
	app.set('view engine', this.get('view engine'));
	
	// Apply locals
	
	if (utils.isObject(this.get('locals'))) {
		_.extend(app.locals, this.get('locals'));
	}
	
	// Indent HTML everywhere, except production

	if (this.get('env') !== 'production') {
		app.locals.pretty = true;
	}
	
	// Default view caching logic

	app.set('view cache', this.get('env') === 'production' ? true : false);
	
	// Setup view caching from app settings

	if (this.get('view cache') !== undefined) {
		app.set('view cache', this.get('view cache'));
	}

	// Serve static assets

	if (this.get('compress')) {
		app.use(express.compress());
	}
	
	if (this.get('favico')) {
		app.use(express.favicon(this.getPath('favico')));
	}
	
	if (this.get('less')) {
		app.use(require('less-middleware')(this.getPath('less')));
	}
	
	if (this.get('sass')) {
		try {
			var sass = require('node-sass');
		} catch(e) {
			if (e.code == 'MODULE_NOT_FOUND') {
				console.error(
					'\nERROR: node-sass not found.\n' +
					'\nPlease install the node-sass from npm to use the `sass` option.' +
					'\nYou can do this by running "npm install node-sass --save".\n'
				);
				process.exit(1);
			} else {
				throw e;
			}
		}
		app.use(sass.middleware({
			src: this.getPath('sass'),
			dest: this.getPath('sass'),
			outputStyle: this.get('env') === 'production' ? 'compressed' : 'nested'
		}));
	}
	
	if (this.get('static')) {
		app.use(express.static(this.getPath('static')));
	}
	
	if (!this.get('headless')) {
		keystone.static(app);
	}
	
	// Handle dynamic requests
	
	if (this.get('logger')) {
		app.use(express.logger(this.get('logger')));
	}
	
	if (this.get('file limit')) {
		app.use(express.limit(this.get('file limit')));
	}
	
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(sessionOptions.cookieParser);
	app.use(express.session(sessionOptions));
	app.use(require('connect-flash')());
	
	if (this.get('session') === true) {
		app.use(this.session.persist);
	} else if ('function' === typeof this.get('session')) {
		app.use(this.get('session'));
	}
	
	// Process 'X-Forwarded-For' request header
	
	if (this.get('trust proxy') === true) {
		app.enable('trust proxy');
	} else {
		app.disable('trust proxy');
	}
	
	// Check for IP range restrictions
	
	if (this.get('allowed ip ranges')) {
		if (!app.get('trust proxy')) {
			console.log(
				'KeystoneJS Initialisaton Error:\n\n' +
				'to set IP range restrictions the "trust proxy" setting must be enabled.\n\n'
			);
			process.exit(1);
		}
		var ipRangeMiddleware = require('./lib/security/ipRangeRestrict')(
			this.get('allowed ip ranges'),
			keystone.wrapHTMLError
		);
		this.pre('routes', ipRangeMiddleware);
	}
	
	// Pre-route middleware
	
	this._pre.routes.forEach(function(fn) {
		try {
			app.use(fn);
		}
		catch(e) {
			if (keystone.get('logger')) {
				console.log('Invalid pre-route middleware provided');
			}
			throw e;
		}
	});
	
	// Route requests
	
	app.use(app.router);
	
	// Headless mode means don't bind the Keystone routes
	
	if (!this.get('headless')) {
		this.routes(app);
	}
	
	// Handle redirects before 404s
	
	if (Object.keys(this._redirects).length) {
		app.use(function(req, res, next) {
			if (keystone._redirects[req.path]) {
				res.redirect(keystone._redirects[req.path]);
			} else {
				next();
			}
		});
	}
	
	// Handle 404 (no route matched) errors
	
	var default404Handler = function(req, res, next) {
		res.status(404).send(keystone.wrapHTMLError("Sorry, no page could be found at this address (404)"));
	};
	
	app.use(function(req, res, next) {
		
		var err404 = keystone.get('404');
		
		if (err404) {
			try {
				if ('function' === typeof err404) {
					err404(req, res, next);
				} else if ('string' === typeof err404) {
					res.status(404).render(err404);
				} else {
					if (keystone.get('logger')) {
						console.log(dashes + 'Error handling 404 (not found): Invalid type (' + (typeof err404) + ') for 404 setting.' + dashes);
					}
					default404Handler(req, res, next);
				}
			} catch(e) {
				if (keystone.get('logger')) {
					console.log(dashes + 'Error handling 404 (not found):');
					console.log(e);
					console.log(dashes);
				}
				default404Handler(req, res, next);
			}
		} else {
			default404Handler(req, res, next);
		}
		
	});
	
	// Handle other errors
	
	var default500Handler = function(err, req, res, next) {
		
		if (keystone.get('logger')) {
			if (err instanceof Error) {
				console.log((err.type ? err.type + ' ' : '') + 'Error thrown for request: ' + req.url);
			} else {
				console.log('Error thrown for request: ' + req.url);
			}
			console.log(err.stack || err);
		}
		
		var msg = '';
		
		if (keystone.get('env') === 'development') {
			
			if (err instanceof Error) {
				if (err.type) {
					msg += '<h2>' + err.type + '</h2>';
				}
				msg += utils.textToHTML(err.message);
			} else if ('object' === typeof err) {
				msg += '<code>' + JSON.stringify(err) + '</code>';
			} else if (err) {
				msg += err;
			}
		}
		
		res.status(500).send(keystone.wrapHTMLError("Sorry, an error occurred loading the page (500)", msg));
	};
	
	app.use(function(err, req, res, next) {
		
		var err500 = keystone.get('500');
		
		if (err500) {
			try {
				if ('function' === typeof err500) {
					err500(err, req, res, next);
				} else if ('string' === typeof err500) {
					res.locals.err = err;
					res.status(500).render(err500);
				} else {
					if (keystone.get('logger')) {
						console.log(dashes + 'Error handling 500 (error): Invalid type (' + (typeof err500) + ') for 500 setting.' + dashes);
					}
					default500Handler(err, req, res, next);
				}
			} catch(e) {
				if (keystone.get('logger')) {
					console.log(dashes + 'Error handling 500 (error):');
					console.log(e);
					console.log(dashes);
				}
				default500Handler(err, req, res, next);
			}
		} else {
			default500Handler(err, req, res, next);
		}
		
	});
	
	// Configure application routes
	if ('function' === typeof this.get('routes')) {
		this.get('routes')(app);
	}
	
	// Connect to database
	
	var mongoConnectionOpen = false;
	
	this.mongoose.connect(this.get('mongo'));
	this.mongoose.connection.on('error', function(err) {
		
		if (keystone.get('logger')) {
			console.log('------------------------------------------------');
			console.log('Mongo Error:\n');
			console.log(err);
		}
		
		if (mongoConnectionOpen) {
			throw new Error("Mongo Error");
		} else {
			throw new Error("KeystoneJS (" + keystone.get('name') + ") failed to start");
		}
		
	}).on('open', function() {
		
		// app is mounted and db connection acquired, time to update and then call back
		
		// Apply updates?
		if (keystone.get('auto update')) {
			keystone.applyUpdates(events.onMount);
		} else {
			events.onMount && events.onMount();
		}
		
	});
};

/**
 * Configures and starts a Keystone app in encapsulated mode.
 *
 * Connects to the database, runs updates and listens for incoming requests.
 *
 * Events are fired during initialisation to allow customisation, including:
 *
 *   - onMount
 *   - onStart
 *   - onHttpServerCreated
 *   - onHttpsServerCreated
 *
 * If the events argument is a function, it is assumed to be the started event.
 *
 *
 * ####Options:
 *
 * Keystone supports the following options specifically for running in encapsulated mode:
 *
 *   - name
 *   - port
 *   - views
 *   - view engine
 *   - compress
 *   - favico
 *   - less
 *   - static
 *   - headless
 *   - logger
 *   - cookie secret
 *   - session
 *   - 404
 *   - 500
 *   - routes
 *   - locals
 *   - auto update
 *   - ssl
 *   - sslport
 *   - sslkey
 *   - sslcert
 *
 *
 * @api public
 */

Keystone.prototype.start = function(events) {
	
	if ('function' === typeof events) {
		events = { onStart: events };
	}
	
	if (!events) events = {};
	
	if (!this.app) {
		throw new Error("KeystoneJS Initialisaton Error:\n\napp must be initialised. Call keystone.init() or keystone.connect(new Express()) first.\n\n");
	}
	
	var keystone = this,
		app = this.app;
		
	//maintain passed in onMount binding but override to start http servers
	//(call user-defined onMount first if present)
	var onMount = events.onMount;
	events.onMount = function() {
		onMount && onMount();
		
		mongoConnectionOpen = true;
		
		var startupMessages = ['KeystoneJS Started:'],
			waitForServers = 2;
			
		// Logs the startup messages and calls the onStart method
		var serverStarted = function() {
			waitForServers--;
			if (waitForServers) return;
			if (keystone.get('logger')) {
				console.log(dashes + startupMessages.join('\n') + dashes);
			}
			events.onStart && events.onStart();
		};
		
		// Creates the http server and listens to the specified port and host or listen option.
		//
		// For more information on how these options work, see
		// http://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback
		// and for history, see https://github.com/JedWatson/keystone/issues/154
		
		keystone.httpServer = http.createServer(app);
		events.onHttpServerCreated && events.onHttpServerCreated();
		
		var host = keystone.get('host'),
			port = keystone.get('port'),
			listen = keystone.get('listen'),
			ssl = keystone.get('ssl');
			
		// start the http server unless we're in ssl-only mode
		if (ssl != 'only') {
			
			var httpStarted = function(msg) {
				return function() {
					startupMessages.push(msg);
					serverStarted();
					};
				};
				
			if (port || port === 0) {
				
				app.set('port', port);
				
				var httpReadyMsg = keystone.get('name') + ' is ready';
				
				if (host) {
					httpReadyMsg += ' on http://' + host;
					if (port) {
						httpReadyMsg += ':' + port;
					}
					// start listening on the specified host and port
					keystone.httpServer.listen(port, host, httpStarted(httpReadyMsg));
				} else {
					if (port) {
						httpReadyMsg += ' on port ' + port;
					}
					// start listening on any IPv4 address (INADDR_ANY) and the specified port
					keystone.httpServer.listen(port, httpStarted(httpReadyMsg));
				}
				
			} else if (host) {
				// start listening on a specific host address and default port 3000
				app.set('port', 3000);
				keystone.httpServer.listen(3000, host, httpStarted(keystone.get('name') + ' is ready on ' + host + ':3000'));
			} else if (listen) {
				// start listening to a unix socket
				keystone.httpServer.listen(listen, httpStarted(keystone.get('name') + ' is ready' + (('string' === typeof listen) ? ' on ' + listen : '')));
			} else {
				// default: start listening on any IPv4 address (INADDR_ANY) and default port 3000
				app.set('port', 3000);
				keystone.httpServer.listen(3000, httpStarted(keystone.get('name') + ' is ready on default port 3000'));
				
			}
			
		} else {
			waitForServers--;
		}
		
		// start the ssl server if configured
		if (ssl) {
			
			var sslOpts = {};
			
			if (keystone.get('ssl cert') && fs.existsSync(keystone.getPath('ssl cert'))) {
				sslOpts.cert = fs.readFileSync(keystone.getPath('ssl cert'));
			}
			if (keystone.get('ssl key') && fs.existsSync(keystone.getPath('ssl key'))) {
				sslOpts.key = fs.readFileSync(keystone.getPath('ssl key'));
			}
			
			if (!sslOpts.key || !sslOpts.cert) {
				
				if (ssl === 'only') {
					console.log(keystone.get('name') + ' failed to start: invalid ssl configuration');
					process.exit();
				} else {
					startupMessages.push('Warning: Invalid SSL Configuration');
					serverStarted();
				}
				
			} else {
				
				var httpsStarted = function(msg) {
					return function() {
						startupMessages.push(msg);
						serverStarted();
						};
					};
					
				keystone.httpsServer = https.createServer(sslOpts, app);
				events.onHttpsServerCreated && events.onHttpsServerCreated();
				
				var sslHost = keystone.get('ssl host') || host,
					sslPort = keystone.get('ssl port') || 3001;
					
				var httpsReadyMsg = (ssl === 'only') ? keystone.get('name') + ' (SSL) is ready on ' : 'SSL Server is ready on ';
				
				if (sslHost) {
					keystone.httpsServer.listen(sslPort, sslHost, httpsStarted(httpsReadyMsg + 'https://' + sslHost + ':' + sslPort));
				} else {
					var httpsPortMsg = (keystone.get('ssl port')) ? 'port: ' + keystone.get('ssl port') : 'default port 3001';
					keystone.httpsServer.listen(sslPort, httpsStarted(httpsReadyMsg + httpsPortMsg));
				}
				
			}
			
		} else {
			waitForServers--;
		}
		
		process.on('uncaughtException', function(e) {
			if (e.code === 'EADDRINUSE') {
				console.log('------------------------------------------------\n' +
					keystone.get('name') + ' failed to start: address already in use\n' +
					'Please check you are not already running a server on the specified port.');
				process.exit();
			}/* else if (e.code === 'ECONNRESET') {
				// Connection reset by peer, ignore it instead of exiting server with a throw.
				// Disabled for release 0.2.16 while further research is being done.
				console.log('Connection reset by peer');
				console.log(e);
			} */else {
				console.log(e.stack || e);
				process.exit(1);
			}
		});
		
	};
	
	//mount the express app
	this.mount(events);
	
	return this;
	
};


/**
 * Adds bindings for keystone static resources
 * Can be included before other middleware (e.g. session management, logging, etc) for
 * reduced overhead
 *
 * @param {Express()} app
 * @api public
 */

Keystone.prototype.static = function(app) {
	
	app.use('/keystone', require('less-middleware')(__dirname + path.sep + 'public'));
	app.use('/keystone', express.static(__dirname + path.sep + 'public'));
	
	return this;
	
};


/**
 * Adds bindings for the keystone routes
 *
 * ####Example:
 *
 *     var app = express();
 *     app.configure(...); // configuration settings
 *     app.use(...); // middleware, routes, etc. should come before keystone is initialised
 *     keystone.routes(app);
 *
 * @param {Express()} app
 * @api public
 */

Keystone.prototype.routes = function(app) {
	
	this.app = app;
	var keystone = this;
	
	// ensure keystone nav has been initialised
	if (!this.nav) {
		this.nav = this.initNav();
	}
	
	// Cache compiled view templates if we are in Production mode
	this.set('view cache', this.get('env') === 'production');
	
	// Bind auth middleware (generic or custom) to /keystone* routes, allowing
	// access to the generic signin page if generic auth is used
	
	if (this.get('auth') === true) {
		
		if (!this.get('signout url')) {
			this.set('signout url', '/keystone/signout');
		}
		if (!this.get('signin url')) {
			this.set('signin url', '/keystone/signin');
		}
		
		if (!this.nativeApp || !this.get('session')) {
			app.all('/keystone*', this.session.persist);
		}
		
		app.all('/keystone/signin', require('./routes/views/signin'));
		app.all('/keystone/signout', require('./routes/views/signout'));
		app.all('/keystone*', this.session.keystoneAuth);
		
	} else if ('function' === typeof this.get('auth')) {
		app.all('/keystone*', this.get('auth'));
	}
	
	var initList = function(protect) {
		return function(req, res, next) {
			req.list = keystone.list(req.params.list);
			if (!req.list || (protect && req.list.get('hidden'))) {
				req.flash('error', 'List ' + req.params.list + ' could not be found.');
				return res.redirect('/keystone');
			}
			next();
		};
	};
	
	// Keystone Admin Route
	app.all('/keystone', require('./routes/views/home'));
	
	// Email test routes
	if (this.get('email tests')) {
		this.bindEmailTestRoutes(app, this.get('email tests'));
	}
	
	// Cloudinary API for image uploading (only if Cloudinary is configured)
	if (keystone.get('wysiwyg cloudinary images')) {
		if (!keystone.get('cloudinary config')) {
			throw new Error("KeystoneJS Initialisaton Error:\n\nTo use wysiwyg cloudinary images, the 'cloudinary config' setting must be configured.\n\n");
		}
		app.post('/keystone/api/cloudinary/upload', require('./routes/api/cloudinary').upload);
	}
	
	// Generic Lists API
	app.all('/keystone/api/:list/:action', initList(), require('./routes/api/list'));
	
	// Generic Lists Download Route
	app.all('/keystone/download/:list', initList(), require('./routes/download/list'));
	
	// List and Item Details Admin Routes
	app.all('/keystone/:list/:page([0-9]{1,5})?', initList(true), require('./routes/views/list'));
	app.all('/keystone/:list/:item', initList(true), require('./routes/views/item'));
	
	return this;
	
};


Keystone.prototype.bindEmailTestRoutes = function(app, emails) {
	
	var keystone = this;
	
	var handleError = function(req, res, err) {
		if (res.err) {
			res.err(err);
		} else {
			// TODO: Nicer default error handler
			res.status(500).send(JSON.stringify(err));
		}
	};
	
	// TODO: Index of email tests, and custom email test 404's (currently bounces to list 404)
	
	_.each(emails, function(vars, key) {
		
		var render = function(err, req, res, locals) {
			new keystone.Email(key).render(locals, function(err, email) {
				if (err) {
					handleError(req, res, err);
				} else {
					res.send(email.html);
				}
			});
		};
		
		app.get('/keystone/test-email/' + key, function(req, res) {
			if ('function' === typeof vars) {
				vars(req, res, function(err, locals) {
					render(err, req, res, locals);
				});
			} else {
				render(null, req, res, vars);
			}
		});
		
	});
	
	return this;
	
};


/**
 * Adds one or more redirections (urls that are redirected when no matching
 * routes are found, before treating the request as a 404)
 *
 * #### Example:
 * 		keystone.redirect('/old-route', 'new-route');
 *
 * 		// or
 *
 * 		keystone.redirect({
 * 			'old-route': 'new-route'
 * 		});
 */

Keystone.prototype.redirect = function() {
	
	if (arguments.length === 1 && utils.isObject(arguments[0])) {
		_.extend(this._redirects, arguments[0]);
	} else if (arguments.length === 2 && 'string' === typeof arguments[0] && 'string' === typeof arguments[1]) {
		this._redirects[arguments[0]] = arguments[1];
	}
	
	return this;
	
};


/**
 * Returns a function that looks in a specified path relative to the current
 * directory, and returns all .js modules it (recursively).
 *
 * ####Example:
 *
 *     var importRoutes = keystone.importer(__dirname);
 *
 *     var routes = {
 *         site: importRoutes('./site'),
 *         api: importRoutes('./api')
 *     };
 *
 * @param {String} rel__dirname
 * @api public
 */

Keystone.prototype.importer = function(rel__dirname) {
	
	var importer = function(from) {
		var imported = {};
		var joinPath = function() {
			return '.' + path.sep + path.join.apply(path, arguments);
		};
		var fsPath = joinPath(path.relative(process.cwd(), rel__dirname), from);
		fs.readdirSync(fsPath).forEach(function(name) {
			var info = fs.statSync(path.join(fsPath, name));
			// recur
			if (info.isDirectory()) {
				imported[name] = importer(joinPath(from, name));
			} else {
				// only import .js files
				var parts = name.split('.');
				var ext = parts.pop();
				if (ext == 'js' || ext == 'coffee') {
					imported[parts.join('-')] = require(path.join(rel__dirname, from, name));
				}
			}
			return imported;
		});
		return imported;
	};
	
	return importer;
	
};


/**
 * returns all .js modules (recursively) in the path specified, relative
 * to the module root (where the keystone project is being consumed from).
 *
 * ####Example:
 *
 *     var models = keystone.import('models');
 *
 * @param {String} dirname
 * @api public
 */

Keystone.prototype.import = function(dirname) {
	
	var initialPath = path.join(moduleRoot, dirname);
	
	var doImport = function(fromPath) {
		
		var imported = {};
		
		fs.readdirSync(fromPath).forEach(function(name) {
			
			var fsPath = path.join(fromPath, name),
			info = fs.statSync(fsPath);
			
			// recur
			if (info.isDirectory()) {
				imported[name] = doImport(fsPath);
			} else {
				// only import .js or .coffee files
				var parts = name.split('.');
				var ext = parts.pop();
				if (ext === 'js' || ext === 'coffee') {
					imported[parts.join('-')] = require(fsPath);
				}
			}
			
		});
		
		return imported;
	};
	
	return doImport(initialPath);
};


/**
 * Registers or retrieves a list
 */

Keystone.prototype.list = function(list) {
	if (list && list.constructor === keystone.List) {
		this.lists[list.key] = list;
		this.paths[list.path] = list.key;
		return list;
	}
	return this.lists[list] || this.lists[this.paths[list]];
};


/**
 * Retrieves orphaned lists (those not in a nav section)
 */

Keystone.prototype.getOrphanedLists = function() {
	if (!this.nav) {
		return [];
	}
	return _.filter(this.lists, function(list, key) {
		if (list.get('hidden')) return false;
		return (!keystone.nav.by.list[key]) ? list : false;
	});
};


/**
 * Applies Application updates
 */

Keystone.prototype.applyUpdates = function(callback) {
	require('./lib/updates').apply(callback);
};


/**
 * Renders a Keystone View
 *
 * @api private
 */

Keystone.prototype.render = function(req, res, view, ext) {
	
	var keystone = this,
		template = templateCache[view];
		
	var templatePath = __dirname + '/templates/views/' + view + '.jade';
	
	var jadeOptions = {
		filename: templatePath,
		pretty: keystone.get('env') !== 'production'
	};
	
	// TODO: Allow custom basePath for extensions... like this or similar
	// if (keystone.get('extensions')) {
	// 	jadeOptions.basedir = keystone.getPath('extensions') + '/templates';
	// }
	
	var compileTemplate = function() {
		return jade.compile(fs.readFileSync(templatePath, 'utf8'), jadeOptions);
	};
	
	var template = this.get('viewCache')
		? templateCache[view] || (templateCache[view] = compileTemplate())
		: compileTemplate();
		
	var flashMessages = {
		info: res.req.flash('info'),
		success: res.req.flash('success'),
		warning: res.req.flash('warning'),
		error: res.req.flash('error'),
		hilight: res.req.flash('hilight')
	};
	
	var locals = {
		_: _,
		moment: moment,
		numeral: numeral,
		env: this.get('env'),
		brand: keystone.get('brand'),
		nav: keystone.nav,
		messages: _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false,
		lists: keystone.lists,
		js: 'javascript:;',
		utils: utils,
		user: req.user,
		title: 'Keystone',
		signout: this.get('signout url'),
		backUrl: this.get('back url') || '/',
		section: {},
		version: this.version,
		csrf_token_key: keystone.security.csrf.TOKEN_KEY,
		csrf_token_value: keystone.security.csrf.getToken(req, res),
		csrf_query: '&' + keystone.security.csrf.TOKEN_KEY + '=' + keystone.security.csrf.getToken(req, res),
		ga: {
			property: this.get('ga property'),
			domain: this.get('ga domain')
		},
		wysiwygOptions: {
			enableImages: keystone.get('wysiwyg images') ? true : false,
			enableCloudinaryUploads: keystone.get('wysiwyg cloudinary images') ? true : false,
			additionalButtons: keystone.get('wysiwyg additional buttons') || ''
		}
	};
	
	// optional extensions to the local scope
	_.extend(locals, ext);
	
	// add cloudinary locals if configured
	if (keystone.get('cloudinary config')) {
		try {
			var cloudinaryUpload = cloudinary.uploader.direct_upload();
			locals.cloudinary = {
				cloud_name: keystone.get('cloudinary config').cloud_name,
				api_key: keystone.get('cloudinary config').api_key,
				timestamp: cloudinaryUpload.hidden_fields.timestamp,
				signature: cloudinaryUpload.hidden_fields.signature,
				prefix: keystone.get('cloudinary prefix') || '',
				uploader: cloudinary.uploader
			};
			locals.cloudinary_js_config = cloudinary.cloudinary_js_config();
		} catch(e) {
			if (e === 'Must supply api_key') {
				throw new Error('Invalid Cloudinary Config Provided\n\n' +
					'See http://keystonejs.com/docs/configuration/#cloudinary for more information.');
			} else {
				throw e;
			}
		}
	}
	
	// fieldLocals defines locals that are provided to each field's `render` method
	locals.fieldLocals = _.pick(locals, '_', 'moment', 'numeral', 'env', 'js', 'utils', 'user', 'cloudinary');
	
	var html = template(_.extend(locals, ext));
	
	res.send(html);
};

/**
 * Populates relationships on a document or array of documents
 *
 * WARNING: This is currently highly inefficient and should only be used in development, or for
 * small data sets. There are lots of things that can be done to improve performance... later.
 *
 * @api public
 */

Keystone.prototype.populateRelated = function(docs, relationships, callback) {
	
	if (Array.isArray(docs)) {
		async.each(docs, function(doc, done) {
			doc.populateRelated(relationships, done);
		}, callback);
	} else if (docs && docs.populateRelated) {
		docs.populateRelated(relationships, callback);
	} else {
		callback();
	}

};

/**
 * Wraps an error in simple HTML to be sent as a response to the browser
 *
 * @api public
 */

Keystone.prototype.wrapHTMLError = function(title, err) {
	return "<html><head><meta charset='utf-8'><title>Error</title>" +
	"<link rel='stylesheet' href='/keystone/styles/error.css'>" +
	"</head><body><div class='error'><h1 class='error-title'>" + title + "</h1>" + "<div class='error-message'>" + (err || '') + "</div></div></body></html>";
};

/**
 * Logs a configuration error to the console
 *
 * @api public
 */

Keystone.prototype.console = {};
Keystone.prototype.console.err = function(type, msg) {
	
	if (keystone.get('logger')) {
		var dashes = '\n------------------------------------------------\n';
		console.log(dashes + 'KeystoneJS: ' + type + ':\n\n' + msg + dashes);
	}
	
};

/**
 * Keystone version
 *
 * @api public
 */

keystone.version = require('./package.json').version;


// Expose Modules
keystone.session = require('./lib/session');
