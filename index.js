var fs = require('fs'),
	_ = require('underscore'),
	express = require('express'),
	jade = require('jade'),
	moment = require('moment'),
	numeral = require('numeral'),
	cloudinary = require('cloudinary'),
	utils = require('./lib/utils');

var templateCache = {};


/**
 * Prospekt Class
 * 
 * @api public
 */

var Prospekt = function() {
	this.lists = {};
	this.paths = {};
	this._options = {
		brand: 'Prospekt',
		copyright: 'Jed Watson'
	};
}

/**
 * The exports object is an instance of Prospekt.
 *
 * @api public
 */
var prospekt = module.exports = exports = new Prospekt;

// Expose Classes
prospekt.List = require('./lib/list');
prospekt.Field = require('./lib/field');
prospekt.Field.Types = require('./lib/fieldTypes');

/**
 * Connects prospekt to the application's mongoose instance
 *
 * ####Example:
 *
 *     var mongoose = require('mongoose');
 *     
 *     prospekt.connect({
 *         mongoose: mongoose
 *     });
 *
 * @param {Object} connections
 * @api public
 */
Prospekt.prototype.connect = function() {
	// detect type of each argument, allowing for future connections to be added
	for (var i = 0; i < arguments.length; i++) {
		if (arguments[i].constructor.name == 'Mongoose') {
			this.mongoose = arguments[i];
		}
	}
	return this;
}


/**
 * Sets prospekt options
 * 
 * ####Options:
 *   - auth (callback function to authenticate a request, or 'native' to use native session management)
 *   - user model (list key for users if using native session management)
 *   - brand (label displayed in the top left of the UI)
 *   - cloudinary config `{cloud_name: '', api_key: '', api_secret: ''}` - alternatively set `process.env.CLOUDINARY_URL`
 *   - cloudinary prefix (prefix for all native tags added to uploaded images)
 *   - signout (href for the signout link in the top right of the UI)
 * 
 * ####Example:
 * 
 *     prospekt.set('user model', 'User') // sets the 'user model' option to `User`
 * 
 * @param {String} key
 * @param {String} value
 * @api public
 */
 Prospekt.prototype.set = function(key, value) {
	
	if (arguments.length == 1)
		return this._options[key];
	
	// handle special settings
	switch (key) {
		case 'cloudinary config':
			cloudinary.config(value);
		break;
	}
	
	this._options[key] = value;
	return this;
};


/**
 * Sets multiple prospekt options.
 *
 * ####Example:
 *
 *     prospekt.set({test: value}) // sets the 'test' option to `value`
 *
 * @param {Object} options
 * @api public
 */

Prospekt.prototype.options = function(options) {
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
	return this;
};


/**
 * Gets prospekt options
 *
 * ####Example:
 *
 *     prospekt.get('test') // returns the 'test' value
 *
 * @param {String} key
 * @method get
 * @api public
 */

Prospekt.prototype.get = Prospekt.prototype.set;


/**
 * Initialises prospekt to use native session management and returns an express
 * middleware callback to hook it in. Must be included before `app.router`.
 *
 * @api public
 */

Prospekt.prototype.session = function() {
	
	var session = require('./lib/session');
	return session.persist;
	
};


/**
 * Adds bindings for prospekt static resources
 * Can be included before other middleware (e.g. session management, logging, etc) for
 * reduced overhead
 *
 * @param {Express()} app
 * @api public
 */

Prospekt.prototype.static = function(app) {
	
	app.use('/prospekt', require('less-middleware')({ src: __dirname + '/public' }));
	app.use('/prospekt', express.static(__dirname + '/public'));
	
};


/**
 * Adds bindings for the prospekt routes
 *
 * ####Example:
 *		
 *     var app = express();
 *     app.configure(...); // configuration settings
 *     app.use(...); // middleware, routes, etc. should come before prospekt is initialised
 *     prospekt.routes(app);
 *
 * @param {Express()} app
 * @api public
 */

Prospekt.prototype.routes = function(app) {
	
	this.app = app;
	var prospekt = this;
	
	this.set('env', app.get('env'));
	this.set('viewCache', this.get('env') == 'production');
	
	var auth = this.get('auth');
	
	if (auth == 'native') {
		this.set('signout', '/prospekt/signout');
		var session = require('./lib/session');
		app.all('/prospekt/signin', require('./routes/signin'));
		app.all('/prospekt/signout', require('./routes/signout'));
		app.all('/prospekt*', session.prospektAuth);
	} else if ('function' == typeof auth) {
		app.all('/prospekt*', auth);
	}
	
	var initList = function(req, res, next) {
		req.list = prospekt.list(req.params.list);
		if (!req.list) {
			req.flash('error', 'List ' + req.params.list + ' could not be found.');
			return res.redirect('/prospekt');
		}
		next();
	}
	
	app.all('/prospekt', require('./routes/home'));
	app.all('/prospekt/:list/:page([0-9]{1,5})?', initList, require('./routes/list'));
	app.all('/prospekt/:list/:item', initList, require('./routes/item'));
	
	app.get('/prospekt/api/:list/:action', initList, require('./routes/api/list') );
	
};


/**
 * Registers or retrieves a list
 */

Prospekt.prototype.list = function(list) {
	if (list && list.constructor == prospekt.List) {
		this.lists[list.key] = list;
		this.paths[list.path] = list.key;
		return list;
	}
	return this.lists[list] || this.lists[this.paths[list]];
};


/**
 * Applies Application updates
 */

Prospekt.prototype.applyUpdates = function(callback) {
	require('./lib/updates').apply(callback);
};


/**
 * Renders a Prospekt View
 *
 * @api private
 */

Prospekt.prototype.render = function(req, res, view, ext) {
	
	var prospekt = this,
		template = templateCache[view];
	
	var templatePath = __dirname + '/views/' + view + '.jade';
	
	var compileTemplate = function() {
		return jade.compile(fs.readFileSync(templatePath, 'utf8'), { filename: templatePath, pretty: prospekt.app.get('env') != 'production' });
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
		brand: prospekt.get('brand'),
		copyright: prospekt.get('copyright'),
		textToHTML: utils.textToHTML,
		messages: _.any(flashMessages, function(msgs) { return msgs.length }) ? flashMessages : false,
		lists: prospekt.lists,
		js: 'javascript:;',
		user: req.user,
		signout: this.get('signout')
	};
	
	var html = template(_.extend(locals, ext));
	
	res.send(html);
}

/**
 * Prospekt version
 *
 * @api public
 */

prospekt.version = JSON.parse(
	require('fs').readFileSync(__dirname + '/package.json', 'utf8')
).version;

