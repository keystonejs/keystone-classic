/*!
 * Module dependencies.
 */

var _ = require('lodash');
var async = require('async');
var keystone = require('../');
var utils = require('keystone-utils');

/**
 * View Constructor
 * =================
 *
 * Helper to simplify view logic in a Keystone application
 *
 * @api public
 */

function View (req, res) {

	if (!req || req.constructor.name !== 'IncomingMessage') {
		throw new Error('Keystone.View Error: Express request object is required.');
	}

	if (!res || res.constructor.name !== 'ServerResponse') {
		throw new Error('Keystone.View Error: Express response object is required.');
	}

	this.req = req;
	this.res = res;

	this.initQueue = [];	// executed first in series
	this.actionQueue = [];	// executed second in parallel, if optional conditions are met
	this.queryQueue = [];	// executed third in parallel
	this.renderQueue = [];	// executed fourth in parallel

}

module.exports = View;


/**
 * Adds a method (or array of methods) to be executed in parallel
 * to the `init`, `action` or `render` queue.
 *
 * @api public
 */

View.prototype.on = function (on) {

	var req = this.req;
	var callback = arguments[1];

	if (typeof on === 'function') {

		/* If the first argument is a function that returns truthy then add the second
		 * argument to the action queue
		 *
		 * Example:
		 *
		 *     view.on(function() {
		 *             var thing = true;
		 *             return thing;
		 *         },
		 *         function(next) {
		 *             console.log('thing is true!');
		 *             next();
		 *         }
		 *     );
		 */

		if (on()) {
			this.actionQueue.push(callback);
		}

	} else if (utils.isObject(on)) {

		/* Do certain actions depending on information in the response object.
		 *
		 * Example:
		 *
		 *     view.on({ 'user.name.first': 'Admin' }, function(next) {
		 *         console.log('Hello Admin!');
		 *         next();
		 *     });
		 */

		var check = function (value, path) {
			var ctx = req;
			var parts = path.split('.');
			for (var i = 0; i < parts.length - 1; i++) {
				if (!ctx[parts[i]]) {
					return false;
				}
				ctx = ctx[parts[i]];
			}
			path = _.last(parts);
			return (value === true && path in ctx) ? true : (ctx[path] === value);
		};

		if (_.every(on, check)) {
			this.actionQueue.push(callback);
		}

	} else if (on === 'get' || on === 'post' || on === 'put' || on === 'delete') {

		/* Handle HTTP verbs
		 *
		 * Example:
		 *     view.on('get', function(next) {
		 *         console.log('GOT!');
		 *         next();
		 *     });
		 */
		if (req.method !== on.toUpperCase()) {
			return this;
		}

		if (arguments.length === 3) {

			/* on a POST and PUT requests search the req.body for a matching value
			 * on every other request search the query.
			 *
			 * Example:
			 *     view.on('post', { action: 'theAction' }, function(next) {
			 *         // respond to the action
			 *         next();
			 *     });
			 *
			 * Example:
			 *     view.on('get', { page: 2 }, function(next) {
			 *         // do something specifically on ?page=2
			 *         next();
			 *     });
			 */

			callback = arguments[2];

			var values = {};
			if (utils.isString(arguments[1])) {
				values[arguments[1]] = true;
			} else {
				values = arguments[1];
			}

			var ctx = (on === 'post' || on === 'put') ? req.body : req.query;

			if (!_.every(values || {}, function (value, path) {
				return (value === true && path in ctx) ? true : (ctx[path] === value);
			})) {
				return this;
			}

		}

		this.actionQueue.push(callback);

	} else if (on === 'init') {

		/* Init events are always fired in series, before any other actions
		 *
		 * Example:
		 *     view.on('init', function (next) {
		 *         // do something before any actions or queries have run
		 *     });
		 */

		this.initQueue.push(callback);

	} else if (on === 'render') {

		/* Render events are always fired last in parallel, after any other actions
		 *
		 * Example:
		 *     view.on('render', function (next) {
		 *         // do something after init, action and query middleware has run
		 *     });
		 */

		this.renderQueue.push(callback);

	}

	// TODO: Should throw if we didn't recognise the first argument!

	return this;

};

var QueryCallbacks = function (options) {
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

QueryCallbacks.prototype.has = function (fn) { return (fn in this.callbacks); };
QueryCallbacks.prototype.err = function (fn) { this.callbacks.err = fn; return this; };
QueryCallbacks.prototype.none = function (fn) { this.callbacks.none = fn; return this; };
QueryCallbacks.prototype.then = function (fn) { this.callbacks.then = fn; return this; };


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
 * Examples:
 *
 * view.query('books', keystone.list('Book').model.find());
 *
 *     an array of books from the database will be added to locals.books. You can
 *     also nest properties on the locals variable.
 *
 * view.query(
 *     'admin.books',
 *      keystone.list('Book').model.find().where('user', 'Admin')
 * );
 *
 *     locals.admin.books will be the result of the query
 *     views.query().then is always called if it is available
 *
 * view.query('books', keystone.list('Book').model.find())
 *     .then(function (err, results, next) {
 *         if (err) return next(err);
 *         console.log(results);
 *         next();
 *     });
 *
 * @api public
 */

View.prototype.query = function (key, query, options) {

	var locals = this.res.locals;
	var parts = key.split('.');
	var chain = new QueryCallbacks(options);

	key = parts.pop();

	for (var i = 0; i < parts.length; i++) {
		if (!locals[parts[i]]) {
			locals[parts[i]] = {};
		}
		locals = locals[parts[i]];
	}

	this.queryQueue.push(function (next) {
		query.exec(function (err, results) {

			locals[key] = results;
			var callbacks = chain.callbacks;

			if (err) {
				if ('err' in callbacks) {
					/* Will pass errors into the err callback
					 *
					 * Example:
					 *     view.query('books', keystone.list('Book'))
					 *         .err(function (err, next) {
					 *             console.log('ERROR: ', err);
					 *             next();
					 *         });
					 */
					return callbacks.err(err, next);
				}
			} else {
				if ((!results || (utils.isArray(results) && !results.length)) && 'none' in callbacks) {
					/* If there are no results view.query().none will be called
					 *
					 * Example:
					 *     view.query('books', keystone.list('Book').model.find())
					 *         .none(function (next) {
					 *             console.log('no results');
					 *             next();
					 *         });
					 */
					return callbacks.none(next);
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
};


/**
 * Executes the current queue of init and action methods in series, and
 * then executes the render function. If renderFn is a string, it is provided
 * to `res.render`.
 *
 * It is expected that *most* init and action stacks require processing in
 * series.  If there are several init or action methods that should be run in
 * parallel, queue them as an array, e.g. `view.on('init', [first, second])`.
 *
 * @api public
 */
View.prototype.render = function (renderFn, locals, callback) {

	var req = this.req;
	var res = this.res;

	if (typeof renderFn === 'string') {
		var viewPath = renderFn;
		renderFn = function () {
			if (typeof locals === 'function') {
				locals = locals();
			}
			this.res.render(viewPath, locals, callback);
		}.bind(this);
	}

	if (typeof renderFn !== 'function') {
		throw new Error('Keystone.View.render() renderFn must be a templatePath (string) or a function.');
	}

	// Add actions, queries & renderQueue to the end of the initQueue
	this.initQueue.push.apply(this.initQueue, this.actionQueue);
	this.initQueue.push.apply(this.initQueue, this.queryQueue);

	var preRenderQueue = [];

	// Add Keystone's global pre('render') queue
	keystone.getMiddleware('pre:render').forEach(function (fn) {
		preRenderQueue.push(function (next) {
			fn(req, res, next);
		});
	});

	this.initQueue.push(preRenderQueue);
	this.initQueue.push(this.renderQueue);

	async.eachSeries(this.initQueue, function (i, next) {
		if (Array.isArray(i)) {
			// process nested arrays in parallel
			async.parallel(i, next);
		} else if (typeof i === 'function') {
			// process single methods in series
			i(next);
		} else {
			throw new Error('Keystone.View.render() events must be functions.');
		}
	}, function (err) {
		renderFn(err, req, res);
	});

};
