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
		if (str in obj) {
			return obj[str];
		} else {
			for (var i = 0; i < parts.length; i++) {
				if (typeof obj !== 'object') return undefined;
				obj = obj[parts[i]];
			}
			return obj;
		}
	};

	this.append = function (append) {
		return str + append;
	};

	return this;

};
