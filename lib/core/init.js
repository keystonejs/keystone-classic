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

var express = require('express');

function init(options) {
	
	this.options(options);
	
	if (!this.app) {
		this.app = express();
	}
	
	if (!this.mongoose) {
		this.connect(require('mongoose'));
	}
	
	return this;
	
}

module.exports = init;
