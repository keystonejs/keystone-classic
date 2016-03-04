var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');
var validators = require('../validators');

/**
 * Color FieldType Constructor
 * @extends Field
 * @api public
 */
function color (list, path, options) {
	this._nativeType = String;
	color.super_.call(this, list, path, options);
}
util.inherits(color, FieldType);

/* Use text validators */
color.prototype.validateInput = validators.text.input;
color.prototype.validateRequiredInput = validators.text.required;

/* Inherit from TextType prototype */
color.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = color;
