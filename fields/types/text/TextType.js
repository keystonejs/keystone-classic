/*!
 * Module dependencies.
 */
var util = require('util');
var utils = require('keystone-utils');
var super_ = require('../Type');

/**
 * Text FieldType Constructor
 * @extends Field
 * @api public
 */
function text(list, path, options) {
	this._nativeType = String;
	this._underscoreMethods = ['crop'];
	text.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */
util.inherits(text, super_);

/**
 * Crops the string to the specifed length.
 *
 * @api public
 */
text.prototype.crop = function(item, length, append, preserveWords) {
	return utils.cropString(item.get(this.path), length, append, preserveWords);
};

/*!
 * Export Field
 */
exports = module.exports = text;
