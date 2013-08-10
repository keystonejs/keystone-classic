/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * Text FieldType Constructor
 * @extends Field
 * @api public
 */

function textarea(list, path, options) {
	this._nativeType = String;
	this._format = true;
	textarea.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(textarea, super_);


/**
 * Formats the field value
 * 
 * @api public
 */

textarea.prototype.format = function(item) {
	return utils.textToHTML(item.get(this.path));
}


/*!
 * Export class
 */

exports = module.exports = textarea;
