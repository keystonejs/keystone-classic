var assign = require('object-assign');
var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');
var validators = require('../validators');

/**
 * HTML FieldType Constructor
 * @extends Field
 * @api public
 */
function code (list, path, options) {
	this._nativeType = String;
	this._defaultSize = 'full';
	this.height = options.height || 180;
	this.lang = options.lang || options.language;
	this._properties = ['editor', 'height', 'lang'];
	this.codemirror = options.codemirror || {};
	this.editor = assign({ mode: this.lang }, this.codemirror);
	code.super_.call(this, list, path, options);
}
util.inherits(code, FieldType);

/* Use text validators */
code.prototype.validateInput = validators.text.input;
code.prototype.validateRequiredInput = validators.text.required;

/* Inherit from TextType prototype */
code.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = code;
