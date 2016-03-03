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
	if (value !== undefined) {
		if (!Array.isArray(value)) {
			value = [value];
		}
		for (var i = 0; i < value.length; i++) {
			var thisValue = value[i];
			if (thisValue && thisValue.toString) {
				thisValue = thisValue.toString();
			}
			if (typeof thisValue[i] !== 'string' && thisValue[i].length) {
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
	if (value === undefined) {
		if (item.get(this.path) && item.get(this.path).length) {
			result = true;
		}
	} else if (value && value.toString) {
		value = value.toString();
	}
	if (typeof value === 'string') {
		result = true;
	} else if (Array.isArray(value)) {
		for (var i = 0; i < value.length; i++) {
			var thisValue = value[i];
			if (thisValue && thisValue.toString) {
				thisValue = thisValue.toString();
			}
			if (typeof thisValue[i] === 'string' && thisValue[i].length) {
				result = true;
				break;
			}
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
