var FieldType = require('../Type');
var numeral = require('numeral');
var util = require('util');
var utils = require('keystone-utils');

/**
 * Number FieldType Constructor
 * @extends Field
 * @api public
 */
function numberarray (list, path, options) {
	this._nativeType = [Number];
	this._underscoreMethods = ['format'];
	this._formatString = (options.format === false) ? false : (options.format || '0,0[.][000000000000]');
	this._defaultSize = 'small';
	if (this._formatString && typeof this._formatString !== 'string') {
		throw new Error('FieldType.Number: options.format must be a string.');
	}
	this.separator = options.separator || ' | ';
	numberarray.super_.call(this, list, path, options);
}
util.inherits(numberarray, FieldType);

/**
 * Formats the field value
 */
numberarray.prototype.format = function (item, format, separator) {
	var value = item.get(this.path);
	if (format || this._formatString) {
		value = value.map(function (n) {
			return numeral(n).format(format || this._formatString);
		});
	}
	return value.join(separator || this.separator);
};

/**
 * Checks if a value is a valid number
 */
function isValidNumber (value) {
	return !Number.isNaN(utils.number(value));
}

/**
 * Asynchronously confirms that the provided value is valid
 */
numberarray.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	var result = true;
	if (value !== undefined) {
		if (!Array.isArray(value)) {
			value = [value];
		}
		for (var i = 0; i < value.length; i++) {
			var thisValue = value[i];
			if (typeof thisValue === 'string') {
				thisValue = utils.number(thisValue);
			}
			if (typeof thisValue !== 'number' || Number.isNaN(thisValue)) {
				result = false;
				break;
			}
		}
	}
	utils.defer(callback, result);
};

/**
 * Asynchronously confirms that the a value is present
 */
numberarray.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	var result = false;
	if (value === undefined) {
		if (item.get(this.path) && item.get(this.path).length) {
			result = true;
		}
	} else if (typeof value === 'string' || typeof value === 'number' || Array.isArray(value) && value.length) {
		result = true;
	}
	utils.defer(callback, result);
};

/**
 * Checks that a valid array of number has been provided in a data object
 * An empty value clears the stored value and is considered valid
 *
 * Deprecated
 */
numberarray.prototype.inputIsValid = function (data, required, item) {
	var value = this.getValueFromData(data);
	if (required) {
		if (value === undefined && item && item.get(this.path) && item.get(this.path).length) {
			return true;
		}
		if (value === undefined || !Array.isArray(value) || (typeof value !== 'string') || (typeof value !== 'number')) {
			return false;
		}
		if (Array.isArray(value) && !value.length) {
			return false;
		}
	}
	if (typeof value === 'string') {
		if (!isValidNumber(value)) {
			return false;
		}
	}
	if (Array.isArray(value)) {
		for (var index = 0; index < value.length; index++) {
			if (!isValidNumber(value[index])) {
				return false;
			}
		}
	}
	return (value === undefined || Array.isArray(value) || (typeof value === 'string') || (typeof value === 'number'));
};

/**
 * Updates the value for this field in the item from a data object
 */
numberarray.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);
	if (typeof value !== 'undefined') {
		if (value === null || value === '') {
			value = [];
		}
		if (!Array.isArray(value)) {
			value = [value];
		}
		value = value.map(function (num) {
			if (typeof num !== 'number') {
				num = utils.number(num);
			}
			return num;
		}).filter(function (num) {
			return !Number.isNaN(num);
		});
		item.set(this.path, value);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = numberarray;
