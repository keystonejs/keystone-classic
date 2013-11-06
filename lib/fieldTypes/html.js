/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('keystone-utils'),
	super_ = require('../field');

/**
 * HTML FieldType Constructor
 * @extends Field
 * @api public
 */

function html(list, path, options) {
	this._nativeType = String;
	this.wysiwyg = (options.wysiwyg) ? true : false;
	this.height = options.height || 180;
	html.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(html, super_);


/*!
 * Export class
 */

exports = module.exports = html;
