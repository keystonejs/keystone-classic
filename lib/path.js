var utils = require('keystone-utils');

/**
 * Path Class
 *
 * @api public
 */

exports = module.exports = function Path(str) {

	if (!(this instanceof Path)) {
		return new Path(str);
	}

	this.original = str;

	var parts = this.parts = str.split('.');
	var last = this.last = this.parts[this.parts.length - 1];
	var exceptLast = [];

	for (var i = 0; i < parts.length - 1; i++) {
		exceptLast.push(parts[i]);
	}

	this.exceptLast = exceptLast.join('.');

	this.addTo = function(obj, val) {
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

	this.get = function(obj) {
		var o = obj;
		for (var i = 0; i < parts.length; i++) {
			if (typeof o !== 'object') return undefined;
			o = o[parts[i]];
		}
		return o;
	};

	this.prependToLast = function(prepend, titlecase) {
		var rtn = '';
		for (var i = 0; i < parts.length - 1; i++) {
			rtn += parts[i] + '.';
		}
		return rtn + (prepend || '') + (titlecase ? utils.upcase(last) : last);
	};

	this.append = function(append) {
		return str + append;
	};

	this.flatten = function(titlecase) {
		return utils.camelcase(parts.join('_'), titlecase ? true : false);
	};

	this.flattenplural = function(titlecase) {
		return utils.camelcase([].concat(exceptLast).concat(utils.plural(last)).join('_'), titlecase ? true : false);
	};

	this.flattensingular = function(titlecase) {
		return utils.camelcase([].concat(exceptLast).concat(utils.singular(last)).join('_'), titlecase ? true : false);
	};

	return this;

};
