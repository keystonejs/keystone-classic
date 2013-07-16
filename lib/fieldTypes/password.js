/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * password FieldType Constructor
 * @extends Field
 * @api public
 */

function password(list, path, options) {
	this._nativeType = String;
	password.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(password, super_);

exports = module.exports = password;
