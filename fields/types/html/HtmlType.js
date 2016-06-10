var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');


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
html.properName = 'Html';
util.inherits(html, FieldType);


html.prototype.validateInput = TextType.prototype.validateInput;
html.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
html.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = html;
