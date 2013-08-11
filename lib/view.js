/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	async = require('async'),
	utils = require('./utils');


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
	
	this.initQueue = [];
	this.actionQueue = [];
	
}

module.exports = exports = View;


/**
 * Adds a method (or array of methods to be executed in parallel
 * to the `init` or `action` queue.
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
			
			return (ctx[parts[i]] == value);
			
		}
		if (_.every(on, check)) {
			this.actionQueue.push(callback);
		}
	} else if (on == 'post' || on == 'get') {
		
		if (req.method != on.toUpperCase()) {
			return;
		}
		
		if (utils.isObject(callback)) {
			values = callback;
			callback = arguments[2];
		}
		
		var ctx = (on == 'post') ? req.body : req.query;
		
		if (_.every(values || {}, function(value, path) {
			return (ctx[path] == value);
		})) {
			this.actionQueue.push(callback);
		}
	
	} else if (on == 'init') {
		this.initQueue.push(callback);
	}
	
	return this;
	
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
	
	if ('string' == typeof callback) {
		var viewPath = callback;
		callback = (function() {
			if ('function' == typeof locals) {
				locals = locals();
			}
			this.res.render(viewPath, locals);
		}).bind(this);
	}
	
	// Add actions to the end of the initQueue
	this.initQueue.push(this.actionQueue);
	
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



