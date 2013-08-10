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
 * Validates that a value for this field has been provided in a data object.
 * Always returns true because a lack of data is considered a 'false' value.
 * 
 * @api public
 */

boolean.prototype.validateInput = function(data) {
	return true;
}


/**
 * Updates the value for this field in the item from a data object.
 * Only updates the value if it has changed.
 * Treats a true boolean or string == 'true' as true, everything else as false.
 * 
 * @api public
 */

boolean.prototype.updateItem = function(item, data) {
	
	if (data[this.path] == true || data[this.path] == 'true') {
		if (!item.get(this.path))
			item.set(this.path, true);
	} else if (item.get(this.path)) {
		item.set(this.path, false);
	}
	
}


/*!
 * Export class
 */

exports = module.exports = boolean;
