var fs = require('fs'),
	_ = require('underscore'),
	express = require('express'),
	mongoose = require('mongoose'),
	jade = require('jade'),
	moment = require('moment'),
	numeral = require('numeral'),
	utils = require('./lib/utils'),
	image = require('./lib/image'),
	List = require('./lib/list'),
	Field = require('./lib/field');

var templateCache = {};


/**
 * Prospekt Class
 *
 * @api internal
 */

var Prospekt = function() {
	this.lists = {};
	this.paths = {};
	this._options = {
		brand: 'Prospekt',
		copyright: 'Jed Watson'
	};
}

Prospekt.prototype.connect = function(_mongoose) {
	mongoose = _mongoose;
	this.mongoose = _mongoose;
	this.List.prototype.mongoose = _mongoose;
	return this;
}


/**
 * Sets prospekt options
 *
 * ####Example:
 *
 *     prospekt.set('test', value) // sets the 'test' option to `value`
 *
 * @param {String} key
 * @param {String} value
 * @api public
 */
 Prospekt.prototype.set = function(key, value) {
	if (arguments.length == 1)
		return this._options[key];
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
 * Adds bindings for prospekt static resources
 * Can be included before other middleware (e.g. session management, logging, etc) for reduced overhead
 *
 * ####Example:
 *		
 *     var app = express();
 *     app.configure(...); // configuration settings
 *     prospekt.static(app);
 *     app.use(...); // other middleware
 *     prospekt.setup(app);
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
	
	var initList = function(req, res, next) {
		req.list = prospekt.list(req.params.list);
		if (!req.list) {
			req.flash('error', 'List ' + req.params.list + ' could not be found.');
			return res.redirect('/prospekt');
		}
		next();
	}
	
	this.set('env', app.get('env'));
	this.set('viewCache', this.get('env') == 'production');
	
	app.all('/prospekt*', function(req, res, next) { if (prospekt.get('auth')) prospekt.get('auth')(req, res, next); else next(); });
	app.all('/prospekt', require('./routes/home'));
	app.all('/prospekt/:list/:page([0-9]{1,5})?', initList, require('./routes/list'));
	app.all('/prospekt/:list/:item', initList, require('./routes/item'));
	
	app.get('/prospekt/api/:list/:action', initList, require('./api/list') );
	
};


/**
 * Registers or retrieves a list
 */

Prospekt.prototype.list = function(list) {
	if (list && list.constructor == List) {
		this.lists[list.key] = list;
		this.paths[list.path] = list.key;
		return list;
	}
	return this.lists[list] || this.lists[this.paths[list]];
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
		image: image,
		brand: prospekt.get('brand'),
		copyright: prospekt.get('copyright'),
		textToHTML: utils.textToHTML,
		messages: _.any(flashMessages, function(msgs) { return msgs.length }) ? flashMessages : false,
		lists: prospekt.lists,
		js: 'javascript:;'
	};
	
	var html = template(_.extend(locals, ext));
	
	res.send(html);
}


/**
 * The exports object is an instance of Prospekt.
 *
 * @api public
 */
var prospekt = module.exports = exports = new Prospekt;


/**
 * Prospekt version
 *
 * @api public
 */

prospekt.version = JSON.parse(
	require('fs').readFileSync(__dirname + '/package.json', 'utf8')
).version;

// Expose Classes
prospekt.List = List;
prospekt.Field = Field;