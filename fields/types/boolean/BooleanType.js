var FieldType = require('../Type');
var util = require('util');
var validators = require('../validators');

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

/* Use boolean validators */
boolean.prototype.validateInput = validators.boolean.input;
boolean.prototype.validateRequiredInput = validators.boolean.required;

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
