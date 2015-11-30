var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');

/**
 * Color FieldType Constructor
 * @extends Field
 * @api public
 */
function color(list, path, options) {
	this._nativeType = String;
	color.super_.call(this, list, path, options);
}
util.inherits(color, FieldType);

/* Inherit from TextType prototype */
color.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = color;
