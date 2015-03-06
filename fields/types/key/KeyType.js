/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('keystone-utils'),
	super_ = require('../Type');

/**
 * Key FieldType Constructor
 * @extends Field
 * @api public
 */

function key(list, path, options) {
	this._nativeType = String;
	this._defaultSize = 'medium';
	
	this.separator = options.separator || '-';
	
	key.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(key, super_);


/**
 * Generates a valid key from a string
 *
 * @api public
 */

key.prototype.generateKey = function(str) {
	return utils.slug(String(str), this.separator);
};


/**
 * Checks that a valid key has been provided in a data object
 *
 * @api public
 */

key.prototype.validateInput = function(data, required, item) {
	
	var value = this.getValueFromData(data);
	
	if (value === undefined && item && item.get(this.path)) {
		return true;
	}

	value = this.generateKey(value);

	return (value || !required);

};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

key.prototype.updateItem = function(item, data) {

	var value = this.getValueFromData(data);
	
	if (value === undefined) {
		return;
	}

	value = this.generateKey(value);

	if (item.get(this.path) !== value) {
		item.set(this.path, value);
	}

};


/*!
 * Export class
 */

exports = module.exports = key;
