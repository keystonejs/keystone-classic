var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');
var validators = require('../validators');

/**
 * HTML FieldType Constructor
 * @extends Field
 * @api public
 */
function html (list, path, options) {
	this._nativeType = String;
	this._defaultSize = 'full';
	this.wysiwyg = options.wysiwyg || false;
	this.height = options.height || 180;
	this._properties = ['wysiwyg', 'height'];
	html.super_.call(this, list, path, options);
}
util.inherits(html, FieldType);

/* Use text validators */
html.prototype.validateInput = validators.text.input;
html.prototype.validateRequiredInput = validators.text.required;

/* Inherit from TextType prototype */
html.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = html;
