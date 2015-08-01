var FieldType = require('../Type');
var numeral = require('numeral');
var util = require('util');
var utils = require('keystone-utils');

/**
 * Number FieldType Constructor
 * @extends Field
 * @api public
 */
function number(list, path, options) {
	this._nativeType = Number;
	this._fixedSize = 'small';
	this._underscoreMethods = ['format'];
	this._formatString = (options.format === false) ? false : (options.format || '0,0[.][000000000000]');
	if (this._formatString && 'string' !== typeof this._formatString) {
		throw new Error('FieldType.Number: options.format must be a string.');
	}
	number.super_.call(this, list, path, options);
}
util.inherits(number, FieldType);

/**
 * Add filters to a query
 */
number.prototype.addFilterToQuery = function(filter, query) {
	query = query || {};
	if (filter.mode === 'equals' && !filter.value) {
		query[this.path] = filter.invert ? { $nin: ['', 0, null] } : { $in: ['', 0, null] };
		return;
	}
	if (filter.mode === 'between') {
		var min = utils.number(value.min);
		var max = utils.number(value.max);
		if (!isNaN(min) && !isNaN(max)) {
			query[this.path] = {
				$gte: min,
				$lte: max
			};
		}
		return;
	}
	var value = utils.number(filter.value);
	if (!isNaN(value)) {
		if (filter.mode === 'gt') {
			query[this.path] = { $gt: value };
		}
		else if (filter.mode === 'lt') {
			query[this.path] = { $lt: value };
		}
		else {
			query[this.path] = value;
		}
	}
	return query;
};

/**
 * Formats the field value
 */
number.prototype.format = function(item, format) {
	if (format || this._formatString) {
		return ('number' === typeof item.get(this.path)) ? numeral(item.get(this.path)).format(format || this._formatString) : '';
	} else {
		return item.get(this.path) || '';
	}
};

/**
 * Checks that a valid number has been provided in a data object
 * An empty value clears the stored value and is considered valid
 */
number.prototype.validateInput = function(data, required, item) {
	var value = this.getValueFromData(data);
	if (value === undefined && item && (item.get(this.path) || item.get(this.path) === 0)) {
		return true;
	}
	if (value !== undefined && value !== '') {
		var newValue = utils.number(value);
		return (!isNaN(newValue));
	} else {
		return (required) ? false : true;
	}
};

/**
 * Updates the value for this field in the item from a data object
 */
number.prototype.updateItem = function(item, data) {
	var value = this.getValueFromData(data);
	if (value === undefined) {
		return;
	}
	var newValue = utils.number(value);
	if (!isNaN(newValue)) {
		if (newValue !== item.get(this.path)) {
			item.set(this.path, newValue);
		}
	} else if ('number' === typeof item.get(this.path)) {
		item.set(this.path, null);
	}
};

/* Export Field Type */
exports = module.exports = number;
