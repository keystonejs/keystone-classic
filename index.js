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
		'auto update': false
	};
	this._pre = {
		routes: [],
		render: []
	};
	
	// init environment defaults
	
	this.set('env', process.env.NODE_ENV || 'development');
	
	this.set('port', process.env.PORT);
	this.set('host', process.env.HOST || process.env.IP);
	this.set('listen', process.env.LISTEN);
	
	this.set('ssl', process.env.SSL);
	this.set('ssl port', process.env.SSL_PORT);
	this.set('ssl host', process.env.SSL_HOST || process.env.SSL_IP);
	this.set('ssl key', process.env.SSL_KEY);
	this.set('ssl cert', process.env.SSL_CERT);
	
	this.set('embedly api key', process.env.EMBEDLY_API_KEY || process.env.EMBEDLY_APIKEY);
	this.set('mandrill api key', process.env.MANDRILL_API_KEY || process.env.MANDRILL_APIKEY);
	this.set('mandrill username', process.env.MANDRILL_USERNAME);
	this.set('google api key', process.env.GOOGLE_BROWSER_KEY);
	this.set('google server api key', process.env.GOOGLE_SERVER_KEY);
	this.set('ga property', process.env.GA_PROPERTY);
	this.set('ga domain', process.env.GA_DOMAIN);
	this.set('chartbeat property', process.env.CHARTBEAT_PROPERTY);
	this.set('chartbeat domain', process.env.CHARTBEAT_DOMAIN);
	
	if (process.env.S3_BUCKET && process.env.S3_KEY && process.env.S3_SECRET) {
		this.set('s3 config', { bucket: process.env.S3_BUCKET, key: process.env.S3_KEY, secret: process.env.S3_SECRET });
	}

	if (process.env.AZURE_STORAGE_ACCOUNT && process.env.AZURE_STORAGE_ACCESS_KEY) {
		this.set('azurefile config', { account: process.env.AZURE_STORAGE_ACCOUNT, key: process.env.AZURE_STORAGE_ACCESS_KEY });
	}
	
	if (process.env.CLOUDINARY_URL) {
		// process.env.CLOUDINARY_URL is processed by the cloudinary package when this is set
		this.set('cloudinary config', true);
	}
	
}


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
	
	if (arguments.length == 1) {
		return this._options[key];
	}
	
	if (remappedOptions[key]) {
		console.log('Warning: the `' + key + '` option has been deprecated. Please use `' + remappedOptions[key] + '` instead.\n\n' +
			'Support for `' + key + '` will be removed in a future version.');
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
 * Gets a path option, expanded to include process.cwd() if it is relative
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
	pathValue = ('string' == typeof pathValue && pathValue.substr(0,1) != path.sep && pathValue.substr(1,2) != ':\\') ? process.cwd() + path.sep + pathValue : pathValue;
	return pathValue;
}


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
}


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
		if (arguments[i].constructor.name == 'Mongoose') {
			// detected Mongoose
			this.mongoose = arguments[i];
		} else if (arguments[i].name == 'app') {
			// detected Express app
			this.app = arguments[i];
		}
	}
	return this;
}


/**
 * The exports object is an instance of Keystone.
 *
 * @api public
 */

var keystone = module.exports = exports = new Keystone;

// Expose modules and Classes
keystone.utils = utils;
keystone.content = require('./lib/content');
keystone.List = require('./lib/list');
keystone.Field = require('./lib/field');
keystone.Field.Types = require('./lib/fieldTypes');
keystone.View = require('./lib/view');
keystone.Email = require('./lib/email');


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
	
	if (!this.app)
		this.app = require('express')();
	
	if (!this.mongoose)
		this.connect(require('mongoose'));
	
	return this;
	
}

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
		if ('string' == typeof section) {
			section = [section];
		}
		section = {
			lists: section,
			label: nav.flat ? keystone.list(section[0]).label : utils.keyToLabel(key)
		};
		section.key = key;
		section.lists = _.map(section.lists, function(i) {
			var list = keystone.list(i);
			if (!list) {
				var msg = 'Invalid Keystone Option (nav): list ' + i + ' has not been defined.\n';
				throw new Error(msg);
			}
			if (list.get('hidden')) {
				var msg = 'Invalid Keystone Option (nav): list ' + i + ' is hidden.\n';
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
}

/**
 * Configures and starts a Keystone app in encapsulated mode.
 * 
 * Connects to the database, runs updates and listens for incoming requests.
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

Keystone.prototype.start = function(onStart) {
	
	if (!this.app) {
		throw new Error("KeystoneJS Initialisaton Error:\n\napp must be initialised. Call keystone.init() or keystone.connect(new Express()) first.\n\n");
	}
	
	onStart = onStart || function() {};
	
	if (!utils.isFunction(onStart)) {
		throw new Error("KeystoneJS Initialisaton Error:\n\nThe onStart argument must be a function or undefined.\n\n");
	}
		
	this.nativeApp = true;
	
	var keystone = this,
		app = this.app,
		dashes = '\n------------------------------------------------\n';
	
	/* Express App Setup */
	
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
	
	if (this.get('env') != 'production') {
		app.locals.pretty = true;
	}
	
	// Serve static assets
	
	if (this.get('compress')) {
		app.use(express.compress());
	}
	
	if (this.get('favico')) {
		app.use(express.favicon(this.getPath('favico')));
	}
	
	if (this.get('less')) {
		app.use(require('less-middleware')({ src: this.getPath('less') }));
	}
	
	if (this.get('static')) {
		app.use(express.static(this.getPath('static')));
	}
	
	if (!this.get('headless')) {
		keystone.static(app);
	}
	
	// Handle dynamic requests
	
	if (this.get('logger'))
		app.use(express.logger(this.get('logger')));
	
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	
	if (this.get('cookie secret')) {
		app.use(express.cookieParser(this.get('cookie secret')));
	}
	app.use(express.session());
	app.use(require('connect-flash')());
	
	if (this.get('session') === true) {
		app.use(this.session.persist);
	} else if ('function' == typeof this.get('session')) {
		app.use(this.get('session'));
	}
	
	// Pre-route middleware
	
	this._pre.routes.forEach(function(fn) {
		try {
			app.use(fn);	
		}
		catch(e) {
			console.log('Pre-route middleware (not found):');
			console.log(e);
		}
	});
	
	// Route requests
	
	app.use(app.router);
	
	// Headless mode means don't bind the Keystone routes
	
	if (!this.get('headless')) {
		this.routes(app);
	}
	
 	// Wraps a message in the default HTML error template
 	// TODO: Put the template somewhere better!
	var wrapHTMLError = function(title, err) {
		return "<html><head><meta charset='utf-8'><title>Error</title>" +
		"<link rel='stylesheet' href='/keystone/styles/error.css'>" +
		"</head><body><div class='error'><h1 class='error-title'>" + title + "</h1>" + "<div class='error-message'>" + (err || '') + "</div></div></body></html>";
	}
	
	// Handle 404 (no route matched) errors
	
	var default404Handler = function(req, res, next) {
		res.status(404).send(wrapHTMLError("Sorry, no page could be found at this address (404)"));
	}
	
	app.use(function(req, res, next) {
		
		var err404 = keystone.get('404');
		
		if (err404) {
			try {
				if ('function' == typeof err404) {
					err404(req, res, next);
				} else if ('string' == typeof err404) {
					res.status(404).render(err404);
				} else {
					console.log(dashes + 'Error handling 404 (not found): Invalid type (' + (typeof err404) + ') for 404 setting.' + dashes);
					default404Handler(req, res, next);
				}
			} catch(e) {
				console.log(dashes + 'Error handling 404 (not found):');
				console.log(e);
				console.log(dashes);
				default404Handler(req, res, next);
			}
		} else {
			default404Handler(req, res, next);
		}
		
	});
	
	// Handle other errors
	
	var default500Handler = function(err, req, res, next) {
		
		if (err instanceof Error) {
			console.log((err.type ? err.type + ' ' : '') + 'Error thrown for request: ' + req.url);
			console.log(err.message);
		} else {
			console.log('Error thrown for request: ' + req.url);
			console.log(err);
		}
		
		var msg = '';
		
		if (keystone.get('env') == 'development') {
			
			if (err instanceof Error) {
				if (err.type) {
					msg += '<h2>' + err.type + '</h2>';
				}
				msg += utils.textToHTML(err.message);
			} else if ('object' == typeof err) {
				msg += '<code>' + JSON.stringify(err) + '</code>';
			} else if (err) {
				msg += err;
			}
		}
		
		res.status(500).send(wrapHTMLError("Sorry, an error occurred loading the page (500)", msg));
	}
	
	app.use(function(err, req, res, next) {
		
		var err500 = keystone.get('500');
		
		if (err500) {
			try {
				if ('function' == typeof err500) {
					err500(err, req, res, next);
				} else if ('string' == typeof err500) {
					res.locals.err = err;
					res.status(500).render(err500);
				} else {
					console.log(dashes + 'Error handling 500 (error): Invalid type (' + (typeof err500) + ') for 500 setting.' + dashes);
					default500Handler(err, req, res, next);
				}
			} catch(e) {
				console.log(dashes + 'Error handling 500 (error):');
				console.log(e);
				console.log(dashes);
				default500Handler(err, req, res, next);
			}
		} else {
			default500Handler(err, req, res, next);
		}
		
	});
	
	// Configure application routes
	if ('function' == typeof this.get('routes')) {
		this.get('routes')(app);
	}

	// Connect to database
	
	var mongooseArgs = this.get('mongo'),
		mongoConnectionOpen = false;
	
	if (!mongooseArgs) {
		mongooseArgs = process.env.MONGO_URI || process.env.MONGO_URL || process.env.MONGOLAB_URI || process.env.MONGOLAB_URL || ['localhost', utils.slug(this.get('name'))];
	}
	
	this.mongoose.connect.apply(this.mongoose, Array.isArray(mongooseArgs) ? mongooseArgs : [mongooseArgs]);
	
	this.mongoose.connection.on('error', function(err) {
		
		console.log('------------------------------------------------');
		console.log('Mongo Error:\n');
		console.log(err);
		
		if (mongoConnectionOpen) {
			throw new Error("Mongo Error");
		} else {
			throw new Error("KeystoneJS (" + keystone.get('name') + ") failed to start");
		}
		
	}).on('open', function() {
		
		mongoConnectionOpen = true;
		
		var startupMessages = ['KeystoneJS Started:'],
			waitForServers = 2;
		
		// Logs the startup messages and calls the onStart method
		var serverStarted = function() {
			waitForServers--;
			if (waitForServers) return;
			console.log(dashes + startupMessages.join('\n') + dashes);
			onStart();
		}
		
		// Creates the http server and listens to the specified port and host or listen option.
		// 
		// For more information on how these options work, see
		// http://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback
		// and for history, see https://github.com/JedWatson/keystone/issues/154
		
		var createServer = function() {
			
			keystone.httpServer = http.createServer(app);
			
			var port = keystone.get('port');
			var ssl = keystone.get('ssl');
			
			// start the http server unless we're in ssl-only mode
			if (ssl != 'only') {
				
				var httpStarted = function(msg) {
					return function() {
						startupMessages.push(msg);
						serverStarted();
					}
				}
				
				if (port) {
					
					app.set('port', port);
					
					if (keystone.get('host')) {
						keystone.httpServer.listen(port, keystone.get('host'), httpStarted(keystone.get('name') + ' is ready on ' + keystone.get('host') + ':' + port));
					} else {
						keystone.httpServer.listen(port, httpStarted(keystone.get('name') + ' is ready on port ' + port));
					}
					
				} else {
					
					var listen = keystone.get('listen') || process.env.LISTEN;
					
					if (listen) {
						keystone.httpServer.listen(listen, httpStarted(keystone.get('name') + ' is ready' + (('string' == typeof listen) ? ' on ' + listen : '')));
					} else {
						keystone.httpServer.listen(3000, httpStarted(keystone.get('name') + ' is ready on default port 3000'));
					}
					
				}
				
			} else {
				waitForServers--;
			}
			
			// start the ssl server if configured
			if (ssl) {
				
				var	sslOpts = {};
				
				if (keystone.get('ssl cert') && fs.existsSync(keystone.getPath('ssl cert'))) {
					sslOpts.cert = fs.readFileSync(keystone.getPath('ssl cert'));
				}
				if (keystone.get('ssl key') && fs.existsSync(keystone.getPath('ssl key'))) {
					sslOpts.key = fs.readFileSync(keystone.getPath('ssl key'));
				}
				
				if (!sslOpts.key || !sslOpts.cert) {
					
					if (ssl == 'only') {
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
						}
					}
					
					keystone.httpsServer = https.createServer(sslOpts, app);
					
					var sslHost = keystone.get('ssl host') || keystone.get('host'),
						sslPort = keystone.get('ssl port') || 3001;
					
					var httpsReadyMsg = (ssl == 'only') ? keystone.get('name') + ' (SSL) is ready on ' : 'SSL Server is ready on ';
					
					if (sslHost) {
						keystone.httpsServer.listen(sslPort, sslHost, httpsStarted(httpsReadyMsg + sslHost + ':' + sslPort));
					} else {
						var httpsPortMsg = (keystone.get('ssl port')) ? 'port: ' + keystone.get('ssl port') : 'default port 3001';
						keystone.httpsServer.listen(sslPort, httpsStarted(httpsReadyMsg + httpsPortMsg));
					}
					
				}

			} else {
				waitForServers--;
			}
			
		}
		
		// Apply updates?
		if (keystone.get('auto update')) {
			keystone.applyUpdates(createServer);
		} else {
			createServer();
		}
		
	});
	
	return this;
	
}


/**
 * Adds bindings for keystone static resources
 * Can be included before other middleware (e.g. session management, logging, etc) for
 * reduced overhead
 *
 * @param {Express()} app
 * @api public
 */

Keystone.prototype.static = function(app) {
	
	app.use('/keystone', require('less-middleware')({ src: __dirname + path.sep + 'public' }));
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
	
	this.set('view cache', this.get('env') == 'production');
	
	var auth = this.get('auth');
	
	if (auth === true) {
		
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
		
	} else if ('function' == typeof auth) {
		app.all('/keystone*', auth);
	}
	
	var initList = function(protect) {
		return function(req, res, next) {
			req.list = keystone.list(req.params.list);
			if (!req.list || (protect && req.list.get('hidden'))) {
				req.flash('error', 'List ' + req.params.list + ' could not be found.');
				return res.redirect('/keystone');
			}
			next();
		}
	}
	
	if (this.get('email tests')) {
		this.bindEmailTestRoutes(app, this.get('email tests'));
	}
	
	app.all('/keystone', require('./routes/views/home'));
	
	app.all('/keystone/download/:list', initList(), require('./routes/download/list'));
	app.all('/keystone/api/:list/:action', initList(), require('./routes/api/list'));
	
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
	}
	
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
		}
		
		app.get('/keystone/test-email/' + key, function(req, res) {
			if ('function' == typeof vars) {
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
		}
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
	}
	
	return importer;
	
}


/**
 * returns all .js modules (recursively) in the path specified, relative
 * to the project root (where the node process is run from).
 *
 * ####Example:
 *		
 *     var models = keystone.import('models');
 *
 * @param {String} dirname
 * @api public
 */

Keystone.prototype.import = function(dirname) {
	
	var doImport = function(fromPath) {
		
		var imported = {};
		
		fs.readdirSync(fromPath).forEach(function(name) {
			
			var fsPath = path.join(fromPath, name)
				info = fs.statSync(fsPath);
			
			// recur
			if (info.isDirectory()) {
				imported[name] = doImport(fsPath);
			} else {
				// only import .js files
				var parts = name.split('.');
				var ext = parts.pop();
				if (ext == 'js' || ext == 'coffee') {
					imported[parts.join('-')] = require(path.join(process.cwd() + path.sep + fsPath));
				}
			}
			
		});
		
		return imported;
		
	}
	
	return doImport('./' + dirname);
	
}


/**
 * Middleware to initialise a standard API response.
 * 
 * Adds `res.apiResonse` and `res.apiError` methods.
 *
 * ####Example:
 *		
 *     app.all('/api*', initAPI);
 *
 * @param {app.request} req
 * @param {app.response} res
 * @param {function} next
 * @api public
 */

Keystone.prototype.initAPI = function(req, res, next) {
	
	res.apiResponse = function(status) {
		if (req.query.callback)
			res.jsonp(status);
		else
			res.json(status);
	};
	
	res.apiError = function(key, err, msg) {
		msg = msg || 'Error';
		key = key || 'unknown error';
		msg += ' (' + key + ')';
		console.log(msg + (err ? ':' : ''));
		if (err) {
			console.log(err);
		}
		res.status(500);
		res.apiResponse({ error: key || 'error', detail: err });
	};
	
	next();
}


/**
 * Registers or retrieves a list
 */

Keystone.prototype.list = function(list) {
	if (list && list.constructor == keystone.List) {
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
		pretty: keystone.get('env') != 'production'
	};
	
	// TODO: Allow custom basePath for extensions... like this or similar
	// if (keystone.get('extensions')) {
	// 	jadeOptions.basedir = keystone.getPath('extensions') + '/templates';
	// }
	
	var compileTemplate = function() {
		return jade.compile(fs.readFileSync(templatePath, 'utf8'), jadeOptions);
	}
	
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
		messages: _.any(flashMessages, function(msgs) { return msgs.length }) ? flashMessages : false,
		lists: keystone.lists,
		js: 'javascript:;',
		utils: utils,
		user: req.user,
		title: 'Keystone',
		signout: this.get('signout url'),
		backUrl: this.get('back url') || '/',
		section: {},
		version: this.version,
		ga: {
			property: this.get('ga property'),
			domain: this.get('ga domain')
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
			if (e == 'Must supply api_key') {
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
}

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
	
}

/**
 * Logs a configuration error to the console
 *
 * @api public
 */

Keystone.prototype.console = {};
Keystone.prototype.console.err = function(type, msg) {
	
	var dashes = '\n------------------------------------------------\n';
	console.log(dashes + 'KeystoneJS: ' + type + ':\n\n' + msg + dashes);
	
}

/**
 * Keystone version
 *
 * @api public
 */

keystone.version = JSON.parse(
	require('fs').readFileSync(__dirname + '/package.json', 'utf8')
).version;


// Expose Modules
keystone.session = require('./lib/session');
