var FieldType = require('../Type');
var numeral = require('numeral');
var util = require('util');
var utils = require('keystone-utils');
var validators = require('../validators');

/**
 * Number FieldType Constructor
 * @extends Field
 * @api public
 */
function number (list, path, options) {
	this._nativeType = Number;
	this._fixedSize = 'small';
	this._underscoreMethods = ['format'];
	this.formatString = (options.format === false) ? false : (options.format || '0,0[.][000000000000]');
	if (this.formatString && typeof this.formatString !== 'string') {
		throw new Error('FieldType.Number: options.format must be a string.');
	}
	number.super_.call(this, list, path, options);
}
util.inherits(number, FieldType);

/* Use number validators */
number.prototype.validateInput = validators.number.input;
number.prototype.validateRequiredInput = validators.number.required;

/**
 * Add filters to a query
 */
number.prototype.addFilterToQuery = function (filter, query) {
	query = query || {};
	if (filter.mode === 'equals' && !filter.value) {
		query[this.path] = filter.inverted ? { $nin: ['', 0, null] } : { $in: ['', 0, null] };
		return;
	}
	if (filter.mode === 'between') {
		var min = utils.number(filter.value.min);
		var max = utils.number(filter.value.max);
		if (!isNaN(min) && !isNaN(max)) {
			query[this.path] = filter.inverted ? { $gte: max, $lte: min } : { $gte: min, $lte: max };
		}
		return;
	}
	var value = utils.number(filter.value);
	if (!isNaN(value)) {
		if (filter.mode === 'gt') {
			query[this.path] = filter.inverted ? { $lt: value } : { $gt: value };
		}
		else if (filter.mode === 'lt') {
			query[this.path] = filter.inverted ? { $gt: value } : { $lt: value };
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
number.prototype.format = function (item, format) {
	var value = item.get(this.path);
	if (format || this.formatString) {
		return (typeof value === 'number') ? numeral(value).format(format || this.formatString) : '';
	} else {
		return value || '';
	}
};

/**
 * Checks that a valid number has been provided in a data object
 * An empty value clears the stored value and is considered valid
 *
 * Deprecated
 */
number.prototype.inputIsValid = function (data, required, item) {
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
number.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);
	if (value === undefined) {
		return process.nextTick(callback);
	}
	var newValue = utils.number(value);
	if (!isNaN(newValue)) {
		if (newValue !== item.get(this.path)) {
			item.set(this.path, newValue);
		}
	} else if (typeof item.get(this.path) === 'number') {
		item.set(this.path, null);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = number;
