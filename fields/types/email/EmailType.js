var crypto = require('crypto');
var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');
var utils = require('keystone-utils');

/**
 * Email FieldType Constructor
 * @extends Field
 * @api public
 */
function email (list, path, options) {
	this._nativeType = String;
	this._underscoreMethods = ['gravatarUrl'];
	this.typeDescription = 'email address';
	email.super_.call(this, list, path, options);
}
email.properName = 'Email';
util.inherits(email, FieldType);

/* Inherit from TextType prototype */
email.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/**
 * Generate a gravatar image request url
 */
email.prototype.gravatarUrl = function (item, size, defaultImage, rating) {
	var value = item.get(this.path);
	if (typeof value !== 'string') {
		return '';
	}
	return [
		// base url protocol-less for both http/https
		'//www.gravatar.com/avatar/',
		// md5 hash the trimmed lowercase email
		crypto.createHash('md5').update(value.toLowerCase().trim()).digest('hex'),
		// size of images ranging from 1 to 2048 pixels, square
		'?s=' + (/^(?:[1-9][0-9]{0,2}|1[0-9]{3}|20[0-3][0-9]|204[0-8])$/.test(size) ? size : 80),
		// default image url encoded href or one of the built in options: 404, mm, identicon, monsterid, wavatar, retro, blank
		'&d=' + (defaultImage ? encodeURIComponent(defaultImage) : 'identicon'),
		// rating, g, pg, r or x
		'&r=' + (/^(?:g|pg|r|x)$/i.test(rating) ? rating.toLowerCase() : 'g'),
	].join('');
};

/**
 * Asynchronously confirms that the provided email is valid
 */
email.prototype.validateInput = function (data, callback) {
	var input = this.getValueFromData(data);
	var result = true;
	if (input) {
		result = utils.isEmail(input);
	}
	utils.defer(callback, result);
};

/**
 * Asynchronously confirms that required input is present
 */
email.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/**
 * Validates that a valid email has been provided in a data object
 *
 * Deprecated
 */
email.prototype.inputIsValid = function (data, required, item) {
	var value = this.getValueFromData(data);
	if (value) {
		return utils.isEmail(value);
	} else {
		return (!required || (item && item.get(this.path))) ? true : false;
	}
};

/**
 * Updates the value for this field in the item from a data object
 * Ensures that the email address is lowercase
 */
email.prototype.updateItem = function (item, data, callback) {
	var newValue = this.getValueFromData(data);
	if (typeof newValue === 'string') {
		newValue = newValue.toLowerCase();
	}
	if (newValue !== undefined && newValue !== item.get(this.path)) {
		item.set(this.path, newValue);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = email;
