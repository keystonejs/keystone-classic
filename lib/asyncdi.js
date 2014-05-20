var _ = require('underscore'),
	async = require('async');

/**
 * Asynchronous Dependency Injection Library
 */

// This regex detects the arguments portion of a function definition
// Thanks to Angular for the regex
var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;


/**
 * Calling the module directly returns a new Wrapper instance
 * 
 * @param  {Function} fn
 * @return {Wrapper}
 */
exports = module.exports = function(fn) {
	return new Wrapper(fn);
};

/**
 * Wrapper Class
 * 
 * @param {Function} fn
 * @param {Object} context
 */
var Wrapper = exports.Wrapper = function Wrapper(fn, context) {
	
	// Ensure a new instance has been created.
	// Calling Wrapper as a function will return a new instance instead.
	if (!(this instanceof Wrapper)) {
		return new Wrapper(fn, context);
	}
	
	// Ensure a function has actually been provided.
	if (!_.isFunction(fn)) {
		throw new Error('AsyncDI Wrapper must be initialised with a function');
	}
	
	// Save the function
	this.fn = fn;
	
	// Detect the dependencies using the regex
	this.deps = fn.toString().match(FN_ARGS)[1].split(',').map(function(i) { return i.trim(); });
	
	// Create a map of dependency names for easy presence detection
	this.requires = {};
	this.deps.forEach(function(i) {
		this.requires[i] = true;
	}, this);
	
	// If the last argument is named 'callback', the function is async.
	// The callback is removed from the dependencies so it doesn't get considered
	// when this.provides() is called
	if (_.last(this.deps) === 'callback') {
		this.isAsync = true;
		this.deps.pop();
	}
	
	// Save the context (may be changed later)
	this._context = context;
	
	// The internal provides object maps dependencies that can be provided if
	// requested by the function
	this._provides = {};
	
	// The internal arguments array contains the provided deps mapped to the
	// arguments requested, and is ready to be applied to the function
	this._arguments = [];
	
};

_.extend(Wrapper.prototype, {
	
	/**
	 * Registers dependencies that can be provided to the function
	 * @param  {Object} provides map of key: value pairs
	 * @return {Wrapper} this instance
	 */
	provides: function(provides) {
		_.extend(this._provides, provides);
		this._arguments = _.map(this.deps, function(key) {
			return this._provides[key];
		}, this);
		return this;
	},
	
	/**
	 * Changes the context of the function to the object provided
	 * @param  {Object} context
	 * @return {Wrapper} this instance
	 */
	bind: function(context) {
		this._context = context;
		return this;
	},
	
	/**
	 * Calls the function
	 * 
	 * Will return the result if not async and no callback is provided
	 * 
	 * @param  {Object} context (optional)
	 * @param  {Function} callback
	 */
	call: function(context, callback) {
		if (arguments.length === 1) {
			callback = context;
			context = this._context;
		}
		if (this.isAsync) {
			// clone the arguments so this.call can be reused with different callbacks
			var asyncArgs = this._arguments.slice();
			// push the callback onto the new arguments array
			asyncArgs.push(callback);
			// call the function
			this.fn.apply(context, asyncArgs);
		} else {
			// if the function isn't async, allow it to be called with or without a callback
			if (callback) {
				// If a callback is provided, it must use the error-first arguments pattern.
				// The return value of the function will be the second argument.
				callback(null, this.fn.apply(context, this._arguments));
			} else {
				// If no callback is provided simply return the result of the function
				return this.fn.apply(context, this._arguments);
			}
		}
	},
	
	/**
	 * Applies the function iterator to each item in arr, in parallel.
	 * 
	 * The context of the function will be the current item in the array.
	 * 
	 * @param  {Array} arr
	 * @param  {Function} callback
	 */
	each: function each(arr, callback) {
		var wrapper = this;
		if (this.isAsync) {
			return async.each(arr, function(item, cb) {
				wrapper.call(item, cb);
			}, callback);
		} else {
			arr.each(function(item) {
				wrapper.call(item);
			});
			if (callback) { callback(); }
		}
	},
	
	/**
	 * Returns the results of interating the function on each item in an array.
	 * 
	 * The context of the function will be the current item in the array.
	 * 
	 * @param  {Array} arr
	 * @param  {Function} callback
	 * @return {Array}
	 */
	map: function map(arr, callback) {
		var wrapper = this;
		if (this.isAsync) {
			async.map(arr, function(item, cb) {
				wrapper.call(item, cb);
			}, callback);
		} else {
			callback(null, arr.map(function(item) {
				return wrapper.call(item);
			}));
		}
	}
	
});
