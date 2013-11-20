/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	keystone = require('../'),
	async = require('async'),
	utils = require('keystone-utils');



/**
 * View Constructor
 * =================
 * 
 * Helper to simplify view logic in a Keystone application
 * 
 * @api public
 */

function View(req, res) {
	
	if (!req || req.constructor.name != 'IncomingMessage') {
		throw new Error('Keystone.View Error: Express request object is required.');
	}
	
	if (!res || res.constructor.name != 'ServerResponse') {
		throw new Error('Keystone.View Error: Express response object is required.');
	}
	
	this.req = req;
	this.res = res;
	
	this.initQueue = [];	// executed first in series
	this.actionQueue = [];	// executed second in parallel, if optional conditions are met
	this.queryQueue = [];	// executed third in parallel
	this.renderQueue = [];	// executed fourth in parallel
	
}

module.exports = exports = View;


/**
 * Adds a method (or array of methods) to be executed in parallel
 * to the `init`, `action` or `render` queue.
 * 
 * @api public
 */

View.prototype.on = function(on) {
	
	var req = this.req,
		callback = arguments[1],
		values;
	
	if ('function' == typeof on) {
		
		if (on()) {
			this.actionQueue.push(callback);
		}
		
	} else if (utils.isObject(on)) {
		
		var check = function(value, path) {
			
			var ctx = req,
				parts = path.split('.');
				
			for (var i = 0; i < parts.length - 1; i++) {
				if (!ctx[parts[i]]) {
					return false;
				}
				ctx = ctx[parts[i]];
			}
			
			return (value === true && path in ctx) ? true : (ctx[path] == value);
			
		}
		
		if (_.every(on, check)) {
			this.actionQueue.push(callback);
		}
		
	} else if (on == 'post' || on == 'get') {
		
		if (req.method != on.toUpperCase()) {
			return;
		}
		
		if (arguments.length == 3) {
			
			if (utils.isString(callback)) {
				values = {};
				values[callback] = true;
			} else {
				values = callback;
			}
			
			callback = arguments[2];
			
			var ctx = (on == 'post') ? req.body : req.query;
			
			if (_.every(values || {}, function(value, path) {
				return (value === true && path in ctx) ? true : (ctx[path] == value);
			})) {
				this.actionQueue.push(callback);
			}
			
		} else {
			this.actionQueue.push(callback);
		}
		
	} else if (on == 'init') {
		this.initQueue.push(callback);
	} else if (on == 'render') {
		this.renderQueue.push(callback);
	}
	
	return this;
	
}


/**
 * Queues a mongoose query for execution before the view is rendered.
 * The results of the query are set in `locals[key]`.
 * 
 * Keys can be nested paths, containing objects will be created as required.
 * 
 * The third argument `then` can be a method to call after the query is completed
 * like function(err, results, callback), or a `populatedRelated` definition
 * (string or array).
 * 
 * @api public
 */

var QueryCallbacks = function(options) {
	if (utils.isString(options)) {
		options = { then: options };
	} else {
		options = options || {};
	}
	this.callbacks = {};
	if (options.err) this.callbacks.err = options.err;
	if (options.none) this.callbacks.none = options.none;
	if (options.then) this.callbacks.then = options.then;
	return this;
};
QueryCallbacks.prototype.has = function(fn) { return (fn in this.callbacks); };
QueryCallbacks.prototype.err = function(fn) { this.callbacks.err = fn; return this; };
QueryCallbacks.prototype.none = function(fn) { this.callbacks.none = fn; return this; };
QueryCallbacks.prototype.then = function(fn) { this.callbacks.then = fn; return this; };

View.prototype.query = function(key, query, options) {
	
	var locals = this.res.locals,
		parts = key.split('.'),
		key = parts.pop(),
		chain = new QueryCallbacks(options);
	
	for (var i = 0; i < parts.length; i++) {
		if (!locals[parts[i]]) {
			locals[parts[i]] = {};
		}
		locals = locals[parts[i]];
	}
	
	this.queryQueue.push(function(next) {
		query.exec(function(err, results) {
			
			locals[key] = results;
			callbacks = chain.callbacks;
			
			if (err) {
				if ('err' in callbacks) {
					return callbacks.err(err);
				}
			} else {
				if ((!results || (utils.isArray(results) && !results.length)) && 'none' in callbacks) {
					return callbacks.none();
				} else if ('then' in callbacks) {
					if (utils.isFunction(callbacks.then)) {
						return callbacks.then(err, results, next);
					} else {
						return keystone.populateRelated(results, callbacks.then, next);
					}
				}
			}
			
			return next(err);
			
		});
	});
	
	return chain;
}


/**
 * Executes the current queue of init and action methods in series, and
 * then executes the callback. If callback is a string, it is provided
 * to `res.render`.
 * 
 * It is expected that *most* init stacks require processing in series,
 * but it is safe to execute actions in parallel.
 * 
 * If there are several init methods that should be run in parallel, queue
 * them as an array, e.g. `view.on('init', [first, second])`.
 * 
 * @api public
 */

View.prototype.render = function(callback, locals) {
	
	var req = this.req,
		res = this.res;
	
	if ('string' == typeof callback) {
		var viewPath = callback;
		callback = (function() {
			if ('function' == typeof locals) {
				locals = locals();
			}
			this.res.render(viewPath, locals);
		}).bind(this);
	}
	
	// Add actions, queries & renderQueue to the end of the initQueue
	this.initQueue.push(this.actionQueue);
	this.initQueue.push(this.queryQueue);
	
	var preRenderQueue = [];
	
	// Add Keystone's global pre('render') queue
	keystone._pre.render.forEach(function(fn) {
		preRenderQueue.push(function(next) {
			fn(req, res, next);
		});
	});
	
	this.initQueue.push(preRenderQueue);
	this.initQueue.push(this.renderQueue);
	
	async.eachSeries(this.initQueue, function(i, next) {
		if (Array.isArray(i)) {
			// process nested arrays in parallel
			async.parallel(i, next);
		} else if ('function' == typeof i) {
			// process single methods in series
			i(next);
		} else {
			throw new Error('Keystone.View.render() Error: events must be functions.');
		}
	}, function(err) {
		// assume error handling is individually implemented in each queue fn, and bail.
		if (!err) {
			callback();
		}
	});
	
}



