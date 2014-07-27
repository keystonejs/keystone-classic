/*!
 * Module dependencies.
 */

var util = require('util'),
	super_ = require('../field');

/**
 * Boolean FieldType Constructor
 * @extends Field
 * @api public
 */

function boolean(list, path, options) {
	this._nativeType = Boolean;
	this.indent = (options.indent) ? true : false;
	boolean.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(boolean, super_);


/**
 * Validates that a truthy value for this field has been provided in a data object.
 *
 * Useful for checkboxes that are required to be true (e.g. agreed to terms and cond's)
 *
 * @api public
 */

boolean.prototype.validateInput = function(data, required) {
	if (required) {
		return (data[this.path] === true || data[this.path] === 'true') ? true : false;
	} else {
		return true;
	}
};


/**
 * Updates the value for this field in the item from a data object.
 * Only updates the value if it has changed.
 * Treats a true boolean or string == 'true' as true, everything else as false.
 *
 * @api public
 */

boolean.prototype.updateItem = function(item, data) {

	if (data[this.path] === true || data[this.path] === 'true') {
		if (!item.get(this.path))
			item.set(this.path, true);
	} else if (item.get(this.path)) {
		item.set(this.path, false);
	}

};


/*!
 * Export class
 */

exports = module.exports = boolean;
