var _ = require('underscore');
var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');

/**
 * HTML FieldType Constructor
 * @extends Field
 * @api public
 */
function codemirror(list, path, options) {
	this._nativeType = String;
	this._defaultSize = 'full';
	this.height = options.height || 180;
	this.lang = options.lang || options.language;
	this._properties = ['editor', 'height', 'lang'];
	this.config = options.config || {};
	this.editor = _.defaults(this.config, { mode : this.lang });
	codemirror.super_.call(this, list, path, options);
}
util.inherits(codemirror, FieldType);

/* Inherit from TextType prototype */
codemirror.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = codemirror;
