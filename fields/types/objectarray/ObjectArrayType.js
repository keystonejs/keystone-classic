/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('keystone-utils'),
	Schema = require('mongoose').Schema,
	super_ = require('../Type');

/**
 * ObjectArray FieldType Constructor
 * @extends Field
 * @api public
 */

function objectarray(list, path, options) {
	this._nativeType = [Schema.Types.Mixed];
	this._properties = ['parts', 'itemLabel'];

	this.itemLabel = options.itemLabel || 'Item';
	this.parts = options.parts;

	objectarray.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(objectarray, super_);

/**
 * Validates that a value for this field has been provided in a data object
 *
 * @api public
 */

objectarray.prototype.validateInput = function(data, required, item) {
	var value = this.getValueFromData(data);

	if (required) {
		if (value === undefined && item && item.get(this.path) && item.get(this.path).length) {
			return true;
		}

		if (value === undefined || !Array.isArray(value)) {
			return false;
		}

		if (Array.isArray(value) && !value.length) {
			return false;
		}

		return true;
	}

	return (value === undefined || Array.isArray(value));
};

/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

objectarray.prototype.updateItem = function(item, data) {
	var value = this.getValueFromData(data);

	if (typeof value === 'undefined' || value === null || !value) {
		value = [];
	}

	if (Array.isArray(value)) {
		item.set(this.path, value);
	} else {
		item.set(this.path, []);
	}
};

/*!
 * Export class
 */

exports = module.exports = objectarray;
