/*!
 * Module dependencies.
 */

var util = require('util'),
	super_ = require('../Type');

/**
 * URL FieldType Constructor
 * @extends Field
 * @api public
 */

function url(list, path, options) {
	this._nativeType = String;
	this._underscoreMethods = ['format'];
	this.formatUrl = options.format;
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
	var url = (item.get(this.path) || '');

	return this.formatUrl ? this.formatUrl(url) : url.replace(/^[a-zA-Z]+\:\/\//, '');
};


// TODO: Proper url validation


/*!
 * Export class
 */

exports = module.exports = url;
