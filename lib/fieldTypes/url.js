/*!
 * Module dependencies.
 */

var util = require('util'),
	super_ = require('../field');

/**
 * URL FieldType Constructor
 * @extends Field
 * @api public
 */

function url(list, path, options) {
	this._nativeType = String;
	this._underscoreMethods = ['format'];
	url.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(url, super_);


/**
 * Formats the field value
 *
 * Strips the leading protocol from the value for simpler display
 *
 * @api public
 */

url.prototype.format = function(item) {
	return (item.get(this.path) || '').replace(/^[a-zA-Z]\:\/\//, '');
};


// TODO: Proper url validation


/*!
 * Export class
 */

exports = module.exports = url;
