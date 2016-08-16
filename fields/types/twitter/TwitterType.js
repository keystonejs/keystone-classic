var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');


/**
 * URL FieldType Constructor
 * @extends Field
 * @api public
 */
function twitter (list, path, options) {
	this._nativeType = String;
	this._underscoreMethods = ['format'];
	url.super_.call(this, list, path, options);
}
url.properName = 'Twitter';
util.inherits(url, FieldType);

url.prototype.validateInput = TextType.prototype.validateInput;
url.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
url.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/**
 * Formats the field value using either a supplied format function or default
 * which strips the leading protocol from the value for simpler display
 */
url.prototype.format = function (item) {
	var url = item.get(this.path) || '';
	if (this.options.format === false) {
		return url;
	} else if (typeof this.options.format === 'function') {
		return this.options.format(url);
	} else {
		return removeProtocolPrefix(url);
	}
};

/**
 * Remove the protocol prefix from url
 */
function removeProtocolPrefix (url) {
	return url.replace(/^[a-zA-Z]+\:\/\//, '');
}

/* Export Field Type */
module.exports = url;
