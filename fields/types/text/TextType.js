var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');

/**
 * Text FieldType Constructor
 * @extends Field
 * @api public
 */
function text(list, path, options) {
	this._nativeType = String;
	this._underscoreMethods = ['crop'];
	text.super_.call(this, list, path, options);
}
util.inherits(text, FieldType);

/**
 * Add filters to a query
 */
text.prototype.addFilterToQuery = function(filter, query) {
	query = query || {};
	if (filter.mode === 'match' && !filter.value) {
		query[this.path] = filter.invert ? { $nin: ['', null] } : { $in: ['', null] };
		return;
	}
	var value = utils.escapeRegExp(filter.value);
	if (filter.mode === 'startsWith') {
		value = '^' + value;
	} else if (filter.mode === 'endsWith') {
		value = value + '$';
	} else if (filter.mode === 'match') {
		value = '^' + value + '$';
	}
	value = new RegExp(value, filter.caseSensitive ? '' : 'i');
	query[this.path] = filter.invert ? { $not: value } : value;
	return query;
};

/**
 * Crops the string to the specifed length.
 */
text.prototype.crop = function(item, length, append, preserveWords) {
	return utils.cropString(item.get(this.path), length, append, preserveWords);
};

/* Export Field Type */
exports = module.exports = text;
