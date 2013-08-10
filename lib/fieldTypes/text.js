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

function text(list, path, options) {
	this._nativeType = String;
	text.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(text, super_);


/*!
 * Export class
 */

exports = module.exports = text;
