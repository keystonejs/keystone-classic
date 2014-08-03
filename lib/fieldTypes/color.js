/*!
 * Module dependencies.
 */

var util = require('util'),
	super_ = require('../field');

/**
 * Color FieldType Constructor
 * @extends Field
 * @api public
 */

function color(list, path, options) {
	this._nativeType = String;
	this._underscoreMethods = [];
	color.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(color, super_);


/*!
 * Export class
 */

exports = module.exports = color;
