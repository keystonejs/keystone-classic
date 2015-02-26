var _ = require('underscore'),
	keystone = require('../');

/**
 * Store Class
 *
 * @param {String} key
 * @param {Object} options
 * @api public
 */

function Store(name, options) {
	if (!(this instanceof Store)) return new Store(key, options);

	keystone.stores[name] = this;

	var Adapter = options.adapter;

	if ('string' === typeof Adapter) {
		Adapter = require('../fields/adapters/storage/' + Adapter);
	}

	if ('function' !== typeof Adapter) {
		throw new TypeError('invalid adapter');
	}

	this.adapter = new Adapter(options);
}


Store.prototype.uploadFile = function(data, callback) {
	callback = callback || function() {};
	this.adapter.uploadFile(data, callback);
};

Store.prototype.deleteFile = function(data, callback) {
	callback = callback || function() {};
	this.adapter.deleteFile(data, callback);
};

/*!
 * Export class
 */

exports = module.exports = Store;
