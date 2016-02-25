var FieldType = require('../Type');
var utils = require('keystone-utils');
var util = require('util');

/**
 * Boolean FieldType Constructor
 * @extends Field
 * @api public
 */
function boolean (list, path, options) {
	this._nativeType = Boolean;
	this._properties = ['indent'];
	this._fixedSize = 'full';
	this.indent = (options.indent) ? true : false;
	boolean.super_.call(this, list, path, options);
}
util.inherits(boolean, FieldType);

/**
 * Add filters to a query
 */
boolean.prototype.addFilterToQuery = function (filter, query) {
	query = query || {};
	if (!filter.value || filter.value === 'false') {
		query[this.path] = { $ne: true };
	} else {
		query[this.path] = true;
	}
	return query;
};

/**
 * Checks whether a provided value for the field is in a valid format
 * Since undefined and falsy values are false, and everything truthy is true,
 * this method always returns true for boolean fields.
 *
 * @api public
 */
boolean.prototype.validateInput = function (data, callback) {
	utils.defer(callback, true);
};

/**
 * Validates that a truthy value for this field has been provided,
 * or that there is an existing truthy value in the item
 *
 * @api public
 */
boolean.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	var result = (value && value !== 'false') || item.get(this.path) ? true : false;
	utils.defer(callback, result);
};

/**
 * Validates that a truthy value for this field has been provided in a data object.
 * Useful for checkboxes that are required to be true (e.g. agreed to terms and cond's)
 *
 * Deprecated
 */
boolean.prototype.inputIsValid = function (data, required) {
	if (required) {
		return (data[this.path] === true || data[this.path] === 'true') ? true : false;
	} else {
		return true;
	}
};

/**
 * Updates the value for this field in the item from a data object.
 * Only updates the value if it has changed.
 * Treats a falsy value or the string "false" as false, everything else as true.
 */
boolean.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);
	if (!value || value === 'false') {
		if (item.get(this.path) !== false) {
			item.set(this.path, false);
		}
	} else if (!item.get(this.path)) {
		item.set(this.path, true);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = boolean;
