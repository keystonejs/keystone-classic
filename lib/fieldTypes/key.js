/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('keystone-utils'),
	super_ = require('../field');

/**
 * Key FieldType Constructor
 * @extends Field
 * @api public
 */

function key(list, path, options) {
	this._nativeType = String;
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

	if (!(this.path in data) && item && item.get(this.path)) return true;

	var newValue = this.generateKey(data[this.path]);

	return (newValue || !required);

};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

key.prototype.updateItem = function(item, data) {

	if (!(this.path in data)) {
		return;
	}

	var newValue = this.generateKey(data[this.path]);

	if (item.get(this.path) !== newValue) {
		item.set(this.path, newValue);
	}

};


/*!
 * Export class
 */

exports = module.exports = key;
