var utils = require('keystone-utils');

/**
 * Path Class
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

	this.get = function (obj, subpath) {
		if (typeof obj !== 'object') throw new TypeError('Path.get: obj argument must be an Object');
		var i;
		if (subpath) {
			var nested = subpath.charAt(0) === '.';
			var flatPath = str + subpath;
			if (flatPath in obj) {
				return obj[flatPath];
			}
			for (i = 0; i < parts.length - (nested ? 0 : 1); i++) {
				if (typeof obj !== 'object') return undefined;
				obj = obj[parts[i]];
			}
			if (nested) {
				subpath = subpath.substr(1);
			} else {
				subpath = last + subpath;
			}
			return (typeof obj === 'object') ? obj[subpath] : undefined;
		} else if (str in obj) {
			return obj[str];
		} else {
			for (i = 0; i < parts.length; i++) {
				if (typeof obj !== 'object') return undefined;
				obj = obj[parts[i]];
			}
			return obj;
		}
	};

	return this;

};
