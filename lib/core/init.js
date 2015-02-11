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

var debug = require('debug')('keystone:core:init');

function init(options) {
	debug('initializing app');
	this.options(options);
	
	if (!this.app) {
		this.set('app', require('express')());
	}
	
	if (!this.mongoose) {
		this.set('mongoose', require('mongoose'));
	}
	
	return this;
	
}

module.exports = init;
