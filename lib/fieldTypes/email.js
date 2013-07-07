/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('../utils'),
	Field = require('../field');

/**
 * Email FieldType Constructor
 * @extends Field
 * @api public
 */

function Email(list, path, options) {
	this._nativeType = String;
	Email.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(Email, Field);

exports = module.exports = Email;
