/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('keystone-utils'),
	super_ = require('../field'),
	crypto = require('crypto');

/**
 * Email FieldType Constructor
 * @extends Field
 * @api public
 */

function email(list, path, options) {
	this._nativeType = String;
	this._underscoreMethods = ['gravatarUrl'];
	this.typeDescription = 'email address';
	email.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(email, super_);


/**
 * Validates that a valid email has been provided in a data object
 *
 * @api public
 */

email.prototype.validateInput = function(data, required, item) {
	if (data[this.path]) {
		return utils.isEmail(data[this.path]);
	} else {
		return (!required || (!(this.path in data) && item && item.get(this.path))) ? true : false;
	}
};


/**
 * Updates the value for this field in the item from a data object
 * Ensures that the email address is lowercase
 *
 * @api public
 */

email.prototype.updateItem = function(item, data) {

	var newValue = data[this.path];

	if ('string' === typeof newValue) {
		newValue = newValue.toLowerCase();
	}

	if (this.path in data && data[this.path] !== item.get(this.path)) {
		item.set(this.path, data[this.path]);
	}

};


/**
 * Generate a gravatar image request url
 *
 * @api public
 */
email.prototype.gravatarUrl = function(item, size, defaultImage, rating) {

	var value = item.get(this.path);

	if ('string' !== typeof value) {
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
		'&r=' + (/^(?:g|pg|r|x)$/i.test(rating) ? rating.toLowerCase() : 'g')
	].join('');
};

/*!
 * Export class
 */

exports = module.exports = email;
