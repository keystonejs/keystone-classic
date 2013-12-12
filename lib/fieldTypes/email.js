/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('keystone-utils'),
	super_ = require('../field');

/**
 * Email FieldType Constructor
 * @extends Field
 * @api public
 */

function email(list, path, options) {
	this._nativeType = String;
	this.typeDescription = 'email address';
	email.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */

util.inherits(email, super_);


/**
 * Validates that a valid email has been provided in a data object
 * 
 * @api public
 */

email.prototype.validateInput = function(data, required, item) {
	if (data[this.path]) {
		return utils.isEmail(data[this.path]);
	} else {
		return (!required || (!(this.path in data) && item && item.get(this.path))) ? true : false;
	}
}


/**
 * Updates the value for this field in the item from a data object
 * Ensures that the email address is lowercase
 * 
 * @api public
 */

email.prototype.updateItem = function(item, data) {
	
	var newValue = data[this.path];
	
	if ('string' == typeof newValue) {
		newValue = newValue.toLowerCase();
	}
	
	if (this.path in data && data[this.path] != item.get(this.path)) {
		item.set(this.path, data[this.path]);
	}
	
}


/*!
 * Export class
 */

exports = module.exports = email;
