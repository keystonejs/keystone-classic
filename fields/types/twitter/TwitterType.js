var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');


/**
 * Twitter FieldType Constructor
 * @extends Field
 * @api public
 */
function twitter (list, path, options) {
	this._nativeType = String;
	this._underscoreMethods = ['format'];
	twitter.super_.call(this, list, path, options);
}
twitter.properName = 'Twitter';
util.inherits(twitter, FieldType);

twitter.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
twitter.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

twitter.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	var result = value === undefined || value === null || typeof value === 'string';
	utils.defer(callback, result);
};

/**
 * Formats the field value using either a supplied format function or default
 * which strips the leading protocol from the value for simpler display
 */
twitter.prototype.format = function (item) {
	var twitter = item.get(this.path) || '';
	if (this.options.format === false) {
		return twitter;
	} else if (typeof this.options.format === 'function') {
		return this.options.format(twitter);
	} else {
		return removeProtocolPrefix(twitter);
	}
};

/**
 * Remove the protocol prefix from url
 */
function removeProtocolPrefix (url) {
	return url.replace(/^[a-zA-Z]+\:\/\//, '');
}

/* Export Field Type */
module.exports = twitter;
