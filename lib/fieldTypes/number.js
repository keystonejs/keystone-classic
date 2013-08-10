/*!
 * Module dependencies.
 */

var util = require('util'),
	numeral = require('numeral'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * Number FieldType Constructor
 * @extends Field
 * @api public
 */

function number(list, path, options) {
	this._nativeType = Number;
	this._format = true;
	number.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(number, super_);


/**
 * Formats the field value
 * 
 * @api public
 */

number.prototype.format = function(item, format) {
	return numeral(item.get(this.path)).format(format || '0,0');
}


/*!
 * Export class
 */

exports = module.exports = number;
