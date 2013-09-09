/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('../utils'),
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

email.prototype.validateInput = function(data, required) {
	if (data[this.path]) {
		return utils.isEmail(data[this.path]);
	} else {
		return required ? false : true;
	}
}


/*!
 * Export class
 */

exports = module.exports = email;
