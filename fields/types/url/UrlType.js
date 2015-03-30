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
	this._formatUrl = options.format || removeProtocolPrefix;

	url.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(url, super_);


/**
 * Formats the field value using either a supplied format function or default
 * which strips the leading protocol from the value for simpler display
 *
 * @api public
 */

url.prototype.format = function(item) {
	var url = (item.get(this.path) || '');
	return this._formatUrl(url);
};

/**
 * Remove the protocol prefix from url
 *
 * @api private
 */
function removeProtocolPrefix(url) {
	return url.replace(/^[a-zA-Z]+\:\/\//, '');
}

// TODO: Proper url validation


/*!
 * Export class
 */

exports = module.exports = url;
