/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('../utils'),
	Field = require('../field');

/**
 * Checkbox FieldType Constructor
 * @extends Field
 * @api public
 */

function Checkbox(list, path, options) {
	this._nativeType = Boolean;
	Checkbox.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(Checkbox, Field);

exports = module.exports = Checkbox;
