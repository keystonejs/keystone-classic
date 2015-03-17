/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	util = require('util'),
	super_ = require('../Type');

/**
 * Code FieldType Constructor
 * @extends Field
 * @api public
 */

function code(list, path, options) {

	this._nativeType = String;
	this._defaultSize = 'full';

	this.height = options.height || 180;
	this.lang = options.lang || options.language;
	this.codemirror = options.codemirror || {};
	this.editor = _.defaults(this.codemirror, { mode : this.lang });
	
	this._properties = [ 'editor' ];

	code.super_.call(this, list, path, options);

}

/*!
 * Inherit from Field
 */

util.inherits(code, super_);

/*!
 * Export class
 */

exports = module.exports = code;
