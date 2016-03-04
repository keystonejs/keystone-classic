var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');
var validators = require('../validators');

/**
 * URL FieldType Constructor
 * @extends Field
 * @api public
 */
function url (list, path, options) {
	this._nativeType = String;
	this._underscoreMethods = ['format'];
	this._formatUrl = options.format || removeProtocolPrefix;
	url.super_.call(this, list, path, options);
}
util.inherits(url, FieldType);

/* Use text validators */
// TODO: is it worth adding URL specific validation logic? it would have to be
// robust so as to not trigger invalid cases on valid input, might be so
// flexible that it's not worth adding.
url.prototype.validateInput = validators.text.input;
url.prototype.validateRequiredInput = validators.text.required;

/* Inherit from TextType prototype */
url.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/**
 * Formats the field value using either a supplied format function or default
 * which strips the leading protocol from the value for simpler display
 */
url.prototype.format = function (item) {
	var url = (item.get(this.path) || '');
	return this._formatUrl(url);
};

/**
 * Remove the protocol prefix from url
 */
function removeProtocolPrefix (url) {
	return url.replace(/^[a-zA-Z]+\:\/\//, '');
}

/* Export Field Type */
module.exports = url;
