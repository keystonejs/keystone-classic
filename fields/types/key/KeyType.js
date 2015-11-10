var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');
var utils = require('keystone-utils');

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
util.inherits(key, FieldType);

/* Inherit from TextType prototype */
key.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/**
 * Generates a valid key from a string
 */
key.prototype.generateKey = function(str) {
	return utils.slug(String(str), this.separator);
};

/**
 * Checks that a valid key has been provided in a data object
 */
key.prototype.validateInput = function(data, required, item) {
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

/* Export Field Type */
exports = module.exports = key;
