var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');
var utils = require('keystone-utils');
var stripUsername = require('./utils/stripUsername');

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
		if (value.indexOf('twitter.com/') !== -1 || value.indexOf('twitter.com/@') !== -1) {
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
 * which strips the username for simpler display
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

/* Export Field Type */
module.exports = twitter;
