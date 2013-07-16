/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * Text FieldType Constructor
 * @extends Field
 * @api public
 */

function textarea(list, path, options) {
	this._nativeType = String;
	textarea.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(textarea, super_);

exports = module.exports = textarea;
