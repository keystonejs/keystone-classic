var fs = require('fs'),
	path = require('path'),
	http = require('http'),
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
	
	if (process.env.CLOUDINARY_URL) {
		// process.env.CLOUDINARY_URL is processed by the cloudinary package when this is set
		this.set('cloudinary config', true);
	}
	
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
	
}


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
	
	if (arguments.length == 1)
		return this._options[key];
	
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

Keystone.prototype.getPath = function(key) {
	var path = keystone.get(key);
	path = ('string' == typeof path && path.substr(0,1) != '/') ? process.cwd() + '/' + path : path;
	return path;
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
				console.log('Defined lists:');
				console.log(_.pluck(keystone.lists, 'path'));
				throw new Error('Keystone Nav Error: list ' + i + ' has not been defined.');
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
	
	app.set('views', this.getPath('views') || '/views');
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
		"</head><body><div id='body'><h1>" + title + '</h1>' + (err || '') + "</div></body></html>";
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
	
	this.mongoose.connection.on('error', function() {
		
		if (mongoConnectionOpen) {
			throw new Error("KeystoneJS Error (" + keystone.get('name') + "):\n\nMongo connection error", arguments);
		} else {
			throw new Error("KeystoneJS (" + keystone.get('name') + ") failed to start:\n\nMongo connection error", arguments);
		}
		
	}).on('open', function() {
		
		mongoConnectionOpen = true;
		
		// Returns a callback to log the startup info and call the onStart method
		var started = function(info) {
			return function() {
				console.log(dashes + 'KeystoneJS Started:\n' + info + dashes);
				onStart();
			}
		}
		
		// Creates the http server and listens to the specified port and host or listen option.
		// 
		// For more information on how these options work, see
		// http://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback
		// and for history, see https://github.com/JedWatson/keystone/issues/154
		
		var createServer = function() {
			
			keystone.httpServer = http.createServer(app);
			
			var port = keystone.get('port') || process.env.PORT;
			
			if (port) {
				
				app.set('port', port);
				
				var host = keystone.get('host') || process.env.HOST || process.env.IP;
				
				if (host) {
					keystone.httpServer.listen(port, host, started(keystone.get('name') + ' is ready on ' + host + ':' + port));
				} else {
					keystone.httpServer.listen(port, started(keystone.get('name') + ' is ready on port ' + port));
				}
				
			} else {
				
				var listen = keystone.get('listen') || process.env.LISTEN;
				
				if (listen) {
					keystone.httpServer.listen(listen, started(keystone.get('name') + ' is ready' + (('string' == typeof listen) ? ' on ' + listen : '')));
				} else {
					keystone.httpServer.listen(3000, started(keystone.get('name') + ' is ready on default port 3000'));
				}
				
			}
		}
		
		// Apply updates?
		if (keystone.get('auto update')) {
			keystone.applyUpdates(createServer);
		} else {
			createServer();
		}
		
	});
	
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
	
	app.use('/keystone', require('less-middleware')({ src: __dirname + '/public' }));
	app.use('/keystone', express.static(__dirname + '/public'));
	
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
		
		if (!this.get('signout')) {
			this.set('signout', '/keystone/signout');
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
	
	var initList = function(req, res, next) {
		req.list = keystone.list(req.params.list);
		if (!req.list) {
			req.flash('error', 'List ' + req.params.list + ' could not be found.');
			return res.redirect('/keystone');
		}
		next();
	}
	
	if (this.get('email tests')) {
		this.bindEmailTestRoutes(app, this.get('email tests'));
	}
	
	app.all('/keystone', require('./routes/views/home'));
	
	app.all('/keystone/download/:list', initList, require('./routes/download/list'));
	app.all('/keystone/api/:list/:action', initList, require('./routes/api/list'));
	
	app.all('/keystone/:list/:page([0-9]{1,5})?', initList, require('./routes/views/list'));
	app.all('/keystone/:list/:item', initList, require('./routes/views/item'));
	
};


Keystone.prototype.bindEmailTestRoutes = function(app, emails) {
	
	var keystone = this;
	
	// TODO: Index of email tests, and custom email test 404's (currently bounces to list 404)
	
	_.each(emails, function(vars, key) {
		
		app.get('/keystone/test-email/' + key, function(req, res) {
			new keystone.Email(key).render(vars, function(err, email) {
				if (err) {
					if (res.err) {
						res.err(err);
					} else {
						// TODO: Nicer default error handler
						res.status(500).send(JSON.stringify(err));
					}
				} else {
					res.send(email.html);
				}
			});
		});
		
	});
	
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
		signout: this.get('signout'),
		section: {},
		version: this.version,
		ga: {
			property: this.get('ga property'),
			domain: this.get('ga domain')
		}
	};
	
	if (keystone.get('cloudinary config')) {
		try {
			var cloudinaryUpload = cloudinary.uploader.direct_upload();
			locals.cloudinary = {
				cloud_name: keystone.get('cloudinary config').cloud_name,
				api_key: keystone.get('cloudinary config').api_key,
				timestamp: cloudinaryUpload.hidden_fields.timestamp,
				signature: cloudinaryUpload.hidden_fields.signature
			};
			locals.cloudinary_js_config = cloudinary.cloudinary_js_config();
		} catch(e) {
			if (e == 'Must supply api_key') {
				throw new Error('Invalid Cloudinary Config Provided\n\n' +
					'See http://keystonejs.com/guide/config/#cloudinary for more information.');
			} else {
				throw e;
			}
		}
	}
	
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
