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
	var value = this.getValueFromData(data);
	
	if (value !== undefined && value != item.get(this.path)) { // jshint ignore:line
		item.set(this.path, value);
	} else {
		item.set(this.path, []);
	}
};

/*!
 * Export class
 */

exports = module.exports = textarray;
