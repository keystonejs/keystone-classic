var utils = require('keystone-utils');

/**
 * Path Class
 *
 * @api public
 */

module.exports = function Path (str) {

	if (!(this instanceof Path)) {
		return new Path(str);
	}

	this.original = str;

	var parts = this.parts = str.split('.');
	var last = this.parts[this.parts.length - 1];

	this.addTo = function (obj, val) {
		var o = obj;
		for (var i = 0; i < parts.length - 1; i++) {
			if (!utils.isObject(o[parts[i]])) {
				o[parts[i]] = {};
			}
			o = o[parts[i]];
		}
		o[last] = val;
		return obj;
	};

	this.get = function (obj) {
		var o = obj;
		for (var i = 0; i < parts.length; i++) {
			if (typeof o !== 'object') return undefined;
			o = o[parts[i]];
		}
		return o;
	};

	this.append = function (append) {
		return str + append;
	};

	return this;

};
