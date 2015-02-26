var _ = require('underscore'),
	keystone = require('../');

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

function aliasMethod(key) {
	Store.prototype[key] = function(data, callback) {
		callback = callback || function(err) { throw err; };
		if (this.adapter[key]) {
			this.adapter[key](data, callback);
		} else {
			callback(new ReferenceError("this adapater doesn't support this method"));
		}
	});
}

aliasMethod('uploadFile');
aliasMethod('deleteFile');

exports = module.exports = Store;
