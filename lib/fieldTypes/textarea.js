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

function textarea(list, path, options) {
	this._nativeType = String;
	this._underscoreMethods = ['format', 'crop'];
	this.height = options.height || 90;
	textarea.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(textarea, super_);


/**
 * Formats the field value
 *
 * @api public
 */

textarea.prototype.format = function(item) {
	return utils.textToHTML(item.get(this.path));
};


/**
 * Crops the string to the specifed length.
 *
 * @api public
 */

textarea.prototype.crop = function(item, length, append, preserveWords) {
	return utils.cropString(item.get(this.path), length, append, preserveWords);
};


/**
* Updates the value for this field in the item from a data object
* Ensures that the string doesn't contain line separators
*
* @api public
*/

textarea.prototype.updateItem = function(item, data) {

	if (!(this.path in data))
		return;

	var newValue = data[this.path];

	var newValue = newValue.replace("\u2028", "").replace("\u2029", "");

	if (this.path in data && newValue !== item.get(this.path)) {
		item.set(this.path, newValue);
	}

};


/*!
 * Export class
 */

exports = module.exports = textarea;
