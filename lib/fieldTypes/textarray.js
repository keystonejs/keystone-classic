/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('keystone-utils'),
	super_ = require('../field');

/**
 * TextArray FieldType Constructor
 * @extends Field
 * @api public
 */

function textarray(list, path, options) {
	this._nativeType = [String];

	this._underscoreMethods = ['crop'];
	textarray.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(textarray, super_);


/**
 * Crops the string to the specifed length.
 *
 * @api public
 */

textarray.prototype.crop = function(item, length, append, preserveWords) {
	return utils.cropString(item.get(this.path), length, append, preserveWords);
};

/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

textarray.prototype.updateItem = function(item, data) {
	if ( data[this.path] === undefined ) {
		item.set(this.path, []);
	} else {
		item.set(this.path, data[this.path]);
	}
}

/*!
 * Export class
 */

exports = module.exports = textarray;
