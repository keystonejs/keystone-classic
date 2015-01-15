/*!
 * Module dependencies.
 */

var util = require('util'),
	super_ = require('../Type');

/**
 * Color FieldType Constructor
 * @extends Field
 * @api public
 */

function color(list, path, options) {
	
	this._nativeType = String;
	this._underscoreMethods = [];
	this._fixedSize = 'small';
	
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
