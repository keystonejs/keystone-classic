/**
 * Initialises Keystone with the provided options
 */

function init(options) {
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
