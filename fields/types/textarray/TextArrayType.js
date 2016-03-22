var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');

/**
 * TextArray FieldType Constructor
 * @extends Field
 * @api public
 */
function textarray (list, path, options) {
	this._nativeType = [String];
	this._underscoreMethods = ['format'];
	this.separator = options.separator || ' | ';
	textarray.super_.call(this, list, path, options);
}
util.inherits(textarray, FieldType);

/**
 * Formats the field value
 */
textarray.prototype.format = function (item, separator) {
	return item.get(this.path).join(separator || this.separator);
};

/**
 * Asynchronously confirms that the provided value is valid
 */
textarray.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	var result = true;
	// If the value is null, undefined or an empty string
	// bail early since updateItem sanitizes that just fine
	if (value !== undefined && value !== null && value !== '') {
		// If the value is not an array, convert it to one
		// e.g. if textarr = 'somestring' (which is valid)
		if (!Array.isArray(value)) {
			value = [value];
		}
		for (var i = 0; i < value.length; i++) {
			var thisValue = value[i];
			// If the current value is not a string and is neither false nor
			// undefined, fail the validation
			if (typeof thisValue !== 'string') {
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
textarray.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	var result = false;
	// If the value is undefined and we have something stored already, validate
	if (value === undefined) {
		if (item.get(this.path) && item.get(this.path).length) {
			result = true;
		}
	}
	// If it's a string that's not empty, validate
	if (typeof value === 'string') {
		if (value !== '') {
			result = true;
		}
	// If it's an array of only strings and/or strinigfy-able data, validate
	} else if (Array.isArray(value)) {
		var invalidContent = false;
		for (var i = 0; i < value.length; i++) {
			var thisValue = value[i];
			// If even a single item is not a string or an empty string, invalidate
			if (typeof thisValue !== 'string' || thisValue === '') {
				invalidContent = true;
				break;
			}
		}
		if (invalidContent === false) {
			result = true;
		}
	}
	utils.defer(callback, result);
};

/**
 * Validates that a value for this field has been provided in a data object
 *
 * Deprecated
 */
textarray.prototype.inputIsValid = function (data, required, item) {
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
	return (value === undefined || Array.isArray(value) || (typeof value === 'string') || (typeof value === 'number'));
};

/**
 * Updates the value for this field in the item from a data object
 */
textarray.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);
	if (typeof value !== 'undefined') {
		if (value === null || value === '') {
			value = [];
		}
		if (!Array.isArray(value)) {
			value = [value];
		}
		value = value.map(function (str) {
			if (str && str.toString) {
				str = str.toString();
			}
			return str;
		}).filter(function (str) {
			return (typeof str === 'string' && str);
		});
		item.set(this.path, value);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = textarray;
