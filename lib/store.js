var _ = require('underscore'),
	keystone = require('../');

function Store(name, options) {
	if (!(this instanceof Store)) return new Store(name, options);

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
	Store.prototype[key] = function() {
		var args = _.toArray(arguments),
			argsNum = args.length,
			callback = args[argsNum-1];
		if(!_.isFunction(callback)){
			callback = function(err) { throw err; };
			args.push(callback);
		}
		if (this.adapter[key]) {
			return this.adapter[key].apply(this.adapter, args);
		} else {
			callback(new ReferenceError("this adapter doesn't support method '"+key+"'"));
		}
	};
}

aliasMethod('uploadFile');
aliasMethod('deleteFile');
aliasMethod('fileExists');
aliasMethod('getPaths');

exports = module.exports = Store;
