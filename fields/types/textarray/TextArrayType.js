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
	textarray.super_.call(this, list, path, options);
}
util.inherits(textarray, FieldType);

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
		if (value === null) {
			value = [];
		}
		if (typeof value === 'string') {
			value = [value];
		}
		if (typeof value === 'number') {
			value = [value.toString()];
		}
		if (Array.isArray(value)) {
			item.set(this.path, value);
		}
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = textarray;
