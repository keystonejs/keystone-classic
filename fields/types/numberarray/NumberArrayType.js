/*!
 * Module dependencies.
 */

var util = require('util');
var numeral = require('numeral');
var utils = require('keystone-utils');
var super_ = require('../Type');

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

	numberarray.super_.call(this, list, path, options);

}

/*!
 * Inherit from Field
 */

util.inherits(numberarray, super_);


/**
 * Formats the field value
 *
 * @api public
 */

numberarray.prototype.format = function (item, format) {
	if (format || this._formatString) {
		return (typeof item.get(this.path) === 'number') ? numeral(item.get(this.path)).format(format || this._formatString) : '';
	} else {
		return item.get(this.path) || '';
	}
};

/**
 * Checks if a value is a valid number
 *
 * @api private
 */

function isValidNumber (value) {
	return !isNaN(utils.number(value));
}

/**
 * Checks that a valid array of number has been provided in a data object
 *
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
 *
 * @api public
 */


numberarray.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);

	if (typeof value !== 'undefined') {
		if (Array.isArray(value)) {
			var temp = value.filter(function (temp) {
				if (isValidNumber(temp)) {
					return utils.number(temp);
				}
			});
			value = temp;
		}
		if (value === null) {
			value = [];
		}
		if (typeof value === 'string') {
			if (isValidNumber(value)) {
				value = [utils.number(value)];
			}
		}
		if (typeof value === 'number') {
			value = [value];
		}
		if (Array.isArray(value)) {
			item.set(this.path, value);
		}
	}

	process.nextTick(callback);
};


/*!
 * Export class
 */

module.exports = numberarray;
