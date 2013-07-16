/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * Key FieldType Constructor
 * @extends Field
 * @api public
 */

function key(list, path, options) {
	this._nativeType = String;
	key.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(key, super_);

exports = module.exports = key;
