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
 * Keystone Class
 * 
 * @api public
 */

var Keystone = function() {
	this.lists = {};
	this.paths = {};
	this._options = {
		brand: 'Keystone',
		copyright: 'Jed Watson'
	};
}

/**
 * The exports object is an instance of Keystone.
 *
 * @api public
 */
var keystone = module.exports = exports = new Keystone;

// Expose Classes
keystone.List = require('./lib/list');
keystone.Field = require('./lib/field');
keystone.Field.Types = require('./lib/fieldTypes');

/**
 * Connects keystone to the application's mongoose instance
 *
 * ####Example:
 *
 *     var mongoose = require('mongoose');
 *     
 *     keystone.connect({
 *         mongoose: mongoose
 *     });
 *
 * @param {Object} connections
 * @api public
 */
Keystone.prototype.connect = function() {
	// detect type of each argument, allowing for future connections to be added
	for (var i = 0; i < arguments.length; i++) {
		if (arguments[i].constructor.name == 'Mongoose') {
			this.mongoose = arguments[i];
		}
	}
	return this;
}


/**
 * Sets keystone options
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
	return this;
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
 * Initialises keystone to use native session management and returns an express
 * middleware callback to hook it in. Must be included before `app.router`.
 *
 * @api public
 */

Keystone.prototype.session = function() {
	
	var session = require('./lib/session');
	return session.persist;
	
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
	
	this.set('env', app.get('env'));
	this.set('viewCache', this.get('env') == 'production');
	
	var auth = this.get('auth');
	
	if (auth == 'native') {
		this.set('signout', '/keystone/signout');
		var session = require('./lib/session');
		app.all('/keystone/signin', require('./routes/signin'));
		app.all('/keystone/signout', require('./routes/signout'));
		app.all('/keystone*', session.keystoneAuth);
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
	
	app.get('/keystone/api/:list/:action', initList, require('./routes/api/list') );
	
};


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
		copyright: keystone.get('copyright'),
		textToHTML: utils.textToHTML,
		messages: _.any(flashMessages, function(msgs) { return msgs.length }) ? flashMessages : false,
		lists: keystone.lists,
		js: 'javascript:;',
		user: req.user,
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

