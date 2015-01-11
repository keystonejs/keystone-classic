/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('keystone-utils'),
	super_ = require('../field');

/**
 * Text FieldType Constructor
 * @extends Field
 * @api public
 */

function text(list, path, options) {
	this._nativeType = String;
	this._underscoreMethods = ['crop'];
	text.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(text, super_);


/**
 * Crops the string to the specifed length.
 *
 * @api public
 */

text.prototype.crop = function(item, length, append, preserveWords) {
	return utils.cropString(item.get(this.path), length, append, preserveWords);
};


/**
* Updates the value for this field in the item from a data object
* Ensures that the string doesn't contain line separators
*
* @api public
*/

text.prototype.updateItem = function(item, data) {

	var newValue = this.getValueFromData(data);

	var newValue = newValue.replace("\u2028", "").replace("\u2029", "");

	if (newValue !== item.get(this.path)) {
		item.set(this.path, newValue);
	}

};


/*!
 * Export class
 */

exports = module.exports = text;
