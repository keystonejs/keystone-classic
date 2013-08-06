/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * HTML FieldType Constructor
 * @extends Field
 * @api public
 */

function html(list, path, options) {
	this._nativeType = String;
	this.wysiwyg = (options.wysiwyg) ? true : false;
	html.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(html, super_);

exports = module.exports = html;
