var _ = require('underscore');
var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');

/**
 * HTML FieldType Constructor
 * @extends Field
 * @api public
 */
function code(list, path, options) {
	this._nativeType = String;
	this._defaultSize = 'full';
	this.height = options.height || 180;
	this.lang = options.lang || options.language;
	this._properties = ['editor', 'height', 'lang'];
	this.codemirror = options.codemirror || {};
	this.editor = _.defaults(this.codemirror, { mode : this.lang });
	code.super_.call(this, list, path, options);
}
util.inherits(code, FieldType);

/* Inherit from TextType prototype */
code.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
exports = module.exports = code;
