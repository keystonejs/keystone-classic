/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * Boolean FieldType Constructor
 * @extends Field
 * @api public
 */

function boolean(list, path, options) {
	this._nativeType = Boolean;
	boolean.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(boolean, super_);


/**
 * Updates the value for this field in the item from a data object
 * 
 * @api public
 */
boolean.prototype.updateItem = function(item, data) {
	if (this.path in data)
		item.set(this.path, (data[this.path] == true || data[this.path] == 'true'));
}


exports = module.exports = boolean;
