var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');
var utils = require('keystone-utils');


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

twitter.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	var result = false;
	var detail;
	if (value === undefined || value === null || value === '') {
		result = true;
	} else if (typeof value === 'string') {
		if (value.indexOf('twitter.com/') || value.indexOf('twitter.com/@')) {
			value = stripUsername(value);
		}
		result = /^@?(\w){1,15}$/.test(value);
		detail = 'enter valid twitter username with or without url';
	}
	utils.defer(callback, result, detail);
};

twitter.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
twitter.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

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
		return stripUsername(twitter);
	}
};

/**
 * Strip twitter username from url, remove @
 */
function stripUsername (twitter) {
	if (twitter.charAt(twitter.length - 1) === '/') {
		twitter = twitter.slice(0, -1);
	}
	var replacePosition = twitter.lastIndexOf('/');
	twitter = twitter.substring(replacePosition + 1);
	if (twitter.indexOf('@') + 1) {
		return twitter.replace('@', '');
	}
	return twitter;
}

/* Export Field Type */
module.exports = twitter;
