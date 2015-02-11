/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('keystone-utils'),
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
};

/*!
 * Export class
 */

exports = module.exports = textarray;
