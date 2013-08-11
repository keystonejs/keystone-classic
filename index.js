var fs = require('fs'),
	path = require('path'),
	http = require('http'),
	_ = require('underscore'),
	express = require('express'),
	jade = require('jade'),
	moment = require('moment'),
	numeral = require('numeral'),
	cloudinary = require('cloudinary'),
	mandrillapi = require('mandrill-api'),
	utils = require('./lib/utils');

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
	this.set('env', process.env.NODE_ENV || 'development');
}


/**
 * Sets keystone options
 * 
 * ####Options:
 * 
 *   - auth (callback function to authenticate a request, or true to use native session management)
 *   - user model (list key for users if using native session management)
 *   - brand (label displayed in the top left of the UI)
 *   - cloudinary config `{cloud_name: '', api_key: '', api_secret: ''}` - alternatively set `process.env.CLOUDINARY_URL`
 *   - cloudinary prefix (prefix for all native tags added to uploaded images)
 *   - signout (href for the signout link in the top right of the UI)
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
			cloudinary.config(value);
		break;
		case 'mandrill api key':
			this.mandrillAPI = new mandrillapi.Mandrill(value);
		break;
		case 'auth':
			if (value === true && !this.get('session'))
				this.set('session', true);
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

// Expose Classes
keystone.utils = utils;
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
 * Configures and starts a Keystone app in encapsulated mode.
 * 
 * Connects to the database, runs updates and listens for incoming requests.
 * 
 * 
 * ####Options:
 * 
 * Keystone supports additional options when running in encapsulated mode:
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
 *   - routes
 *   - locals
 *   - auto update
 * 
 *
 * @api public
 */
Keystone.prototype.start = function(onStart) {
	
	if (!this.app)
		throw new Error("Keystone app must be initialised first.");
		
	this.nativeApp = true;
	
	var keystone = this,
		app = this.app;
	
	// Setup
	
	app.set('port', this.get('port') || process.env.PORT || 3000);
	app.set('views', this.getPath('views') || '/views');
	app.set('view engine', this.get('view engine'));
	
	// Apply locals
	
	if (utils.isObject(this.get('locals')))
		_.extend(app.locals, this.get('locals'));
	
	if (this.get('env') != 'production')
		app.locals.pretty = true;
	
	// Serve static assets
	
	if (this.get('compress'))
		app.use(express.compress());
	
	if (this.get('favico'))
		app.use(express.favicon(this.getPath('favico')));
	
	if (this.get('less'))
		app.use(require('less-middleware')({ src: this.getPath('less') }));
	
	if (this.get('static'))
		app.use(express.static(this.getPath('static')));
	
	if (!this.get('headless'))
		keystone.static(app);
	
	// Handle dynamic requests
	
	if (this.get('logger'))
		app.use(express.logger(this.get('logger')));
	
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	
	app.use(express.cookieParser(this.get('cookie secret')));
	app.use(express.session());
	app.use(require('connect-flash')());
	
	if (this.get('session') === true)
		app.use(this.session.persist);
	else if ('function' == typeof this.get('session'))
		app.use(this.get('session'));
	
	// Route requests
	app.use(app.router);
	
	// Handle 404s
	
	var err404 = this.get('404');
	
	if ('function' == typeof err404) {
		app.use(err404);
	} else if ('string' == typeof err404) {
		app.use(function(req, res, next) {
			res.status(404).render(err404);
		});
	} else {
		app.use(function(req, res, next) {
			res.status(404).send("Sorry, no page could be found at this address (404)");
		});
	}
	
	// Use Express error handler in dev
	if (this.get('env') == 'development')
		app.use(express.errorHandler());
	
	// Configure keystone routes
	if (!this.get('headless'))
		this.routes(app);
	
	// Configure application routes
	if ('function' == typeof this.get('routes'))
		this.get('routes')(app);

	// Connect to database
	var mongooseArgs = this.get('mongo');
	this.mongoose.connect.apply(this.mongoose, Array.isArray(mongooseArgs) ? mongooseArgs : [mongooseArgs]);
	
	this.mongoose.connection.on('error', function() {
		console.error(keystone.get('name') + ' failed to launch: mongo connection error', arguments);
	}).on('open', function() {
		
		// Create the http server
		var listen = function() {
			http.createServer(app).listen(app.get('port'), function() {
				console.log(keystone.get('name') + ' is ready on port ' + app.get('port'));
				if ('function' == typeof onStart)
					onStart();
			});
		}
		
		// Apply updates?
		if (keystone.get('auto update'))
			keystone.applyUpdates(listen);
		else
			listen();
		
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
	
	this.set('view cache', this.get('env') == 'production');
	
	var auth = this.get('auth');
	
	if (auth === true) {
		
		this.set('signout', '/keystone/signout');
		
		if (!this.nativeApp || !this.get('session'))
			app.all('/keystone*', this.session.persist);
		
		app.all('/keystone/signin', require('./routes/signin'));
		app.all('/keystone/signout', require('./routes/signout'));
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
	
	app.all('/keystone', require('./routes/home'));
	app.all('/keystone/:list/:page([0-9]{1,5})?', initList, require('./routes/list'));
	app.all('/keystone/:list/:item', initList, require('./routes/item'));
	
	app.all('/keystone/api/:list/:action', initList, require('./routes/api/list') );
	
};


/**
 * Returns a function that looks in a specified path relative to the current
 * directory, and returns all .js modules it.
 *
 * ####Example:
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
			var info = fs.statSync(path.join(fsPath,name));
			// recur
			if (info.isDirectory()) {
				imported[name] = importer(joinPath(from,name));
			} else {
				// only import .js files
				var parts = name.split('.');
				if (parts.pop() == 'js') {
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
		sendResponse({ error: key || 'error', detail: err });
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
	
	var templatePath = __dirname + '/views/' + view + '.jade';
	
	var compileTemplate = function() {
		return jade.compile(fs.readFileSync(templatePath, 'utf8'), { filename: templatePath, pretty: keystone.app.get('env') != 'production' });
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
		brand: keystone.get('brand'),
		textToHTML: utils.textToHTML,
		messages: _.any(flashMessages, function(msgs) { return msgs.length }) ? flashMessages : false,
		lists: keystone.lists,
		js: 'javascript:;',
		utils: utils,
		user: req.user,
		title: 'Keystone',
		signout: this.get('signout')
	};
	
	var html = template(_.extend(locals, ext));
	
	res.send(html);
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
