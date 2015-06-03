/*!
 * Module dependencies.
 */

var util = require('util'),
	super_ = require('../Type');

/**
 * TextArray FieldType Constructor
 * @extends Field
 * @api public
 */

function textarray(list, path, options) {
	this._nativeType = [String];

	textarray.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(textarray, super_);

/**
 * Validates that a value for this field has been provided in a data object
 *
 * @api public
 */

textarray.prototype.validateInput = function(data, required, item) {
	var value = this.getValueFromData(data);

	if (required) {
		if (value === undefined && item && item.get(this.path) && item.get(this.path).length) {
			return true;
		}
		if (value === undefined || !Array.isArray(value) || ('string' !== typeof value) || ('number' !== typeof value)) {
			return false;
		}
		if (Array.isArray(value) && !value.length) {
			return false;
		}
	}
	return (value === undefined || Array.isArray(value) || ('string' === typeof value) || ('number' === typeof value));
};

/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

textarray.prototype.updateItem = function(item, data) {
	var value = this.getValueFromData(data);
	
	if ('undefined' !== typeof value) {
		if (value === null) {
			value = [];
		}
		if ('string' === typeof value) {
			value = [value];
		}
		if ('number' === typeof value) {
			value = [value.toString()];
		}
		if (Array.isArray(value)) {
			item.set(this.path, value);
		}
	}
};

/*!
 * Export class
 */

exports = module.exports = textarray;
