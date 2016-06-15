var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');
var utils = require('keystone-utils');

/**
 * Key FieldType Constructor
 * @extends Field
 * @api public
 */
function key (list, path, options) {
	this._nativeType = String;
	this._defaultSize = 'medium';
	this.separator = options.separator || '-';
	key.super_.call(this, list, path, options);
}
key.properName = 'Key';
util.inherits(key, FieldType);

/* Inherit from TextType prototype */
key.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;
key.prototype.validateInput = TextType.prototype.validateInput;
key.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/**
 * Generates a valid key from a string
 */
key.prototype.generateKey = function (str) {
	return utils.slug(String(str), this.separator);
};

/**
 * Checks that a valid key has been provided in a data object
 *
 * Deprecated
 */
key.prototype.inputIsValid = function (data, required, item) {
	var value = this.getValueFromData(data);
	if (value === undefined && item && item.get(this.path)) {
		return true;
	}
	value = this.generateKey(value);
	return (value || !required) ? true : false;
};

/**
 * Updates the value for this field in the item from a data object
 */
key.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);
	if (value === undefined) {
		return process.nextTick(callback);
	}
	value = this.generateKey(value);
	if (item.get(this.path) !== value) {
		item.set(this.path, value);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = key;
