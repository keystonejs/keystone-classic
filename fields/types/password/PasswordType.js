var _ = require('lodash');
var bcrypt = require('bcrypt-nodejs');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');

var regexChunk = {
	digitChar: /\d/,
	spChar: /[!@#\$%\^&\*()\+]/,
	asciiChar: /^[\u0020-\u007E]+$/,
	lowChar: /[a-z]/,
	upperChar: /[A-Z]/,
};
var detailMsg = {
	digitChar: 'enter at least one digit',
	spChar: 'enter at least one special character',
	asciiChar: 'only ASCII characters are allowed',
	lowChar: 'use at least one lower case character',
	upperChar: 'use at least one upper case character',
};
/**
 * password FieldType Constructor
 * @extends Field
 * @api public
 */
function password (list, path, options) {
	this.options = options;
	this._nativeType = String;
	this._underscoreMethods = ['format', 'compare'];
	this._fixedSize = 'full';
	// You can't sort on password fields
	options.nosort = true;
	this.workFactor = options.workFactor || 10;
	password.super_.call(this, list, path, options);
	for (var key in this.options.complexity) {
		if ({}.hasOwnProperty.call(this.options.complexity, key)) {
			if (key in regexChunk !== key in this.options.complexity) {
				throw new Error('FieldType.Password: options.complexity - option does not exist.');
			}
			if (typeof this.options.complexity[key] !== 'boolean') {
				throw new Error('FieldType.Password: options.complexity - Value must be boolean.');
			}
		}
	}
	if (this.options.max <= this.options.min) {
		throw new Error('FieldType.Password: options - min must be set at a lower value than max.');
	}
}
password.properName = 'Password';
util.inherits(password, FieldType);

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * Adds ...
 *
 * @api public
 */
password.prototype.addToSchema = function (schema) {
	var field = this;
	var needs_hashing = '__' + field.path + '_needs_hashing';

	this.paths = {
		confirm: this.options.confirmPath || this.path + '_confirm',
		hash: this.options.hashPath || this.path + '_hash',
	};

	schema.path(this.path, _.defaults({
		type: String,
		set: function (newValue) {
			this[needs_hashing] = true;
			return newValue;
		},
	}, this.options));

	schema.virtual(this.paths.hash).set(function (newValue) {
		this.set(field.path, newValue);
		this[needs_hashing] = false;
	});

	schema.pre('save', function (next) {
		if (!this.isModified(field.path) || !this[needs_hashing]) {
			return next();
		}
		// reset the [needs_hashing] flag so that new values can't be hashed more than once
		// (inherited models double up on pre save handlers for password fields)
		this[needs_hashing] = false;
		if (!this.get(field.path)) {
			this.set(field.path, undefined);
			return next();
		}
		var item = this;
		bcrypt.genSalt(field.workFactor, function (err, salt) {
			if (err) {
				return next(err);
			}
			bcrypt.hash(item.get(field.path), salt, function () {}, function (err, hash) {
				if (err) {
					return next(err);
				}
				// override the cleartext password with the hashed one
				item.set(field.path, hash);
				next();
			});
		});
	});
	this.bindUnderscoreMethods();
};

/**
 * Add filters to a query
 */
password.prototype.addFilterToQuery = function (filter) {
	var query = {};
	query[this.path] = (filter.exists) ? { $ne: null } : null;
	return query;
};

/**
 * Retrieves the field value
 *
 * Password fields  values are returned as booleans to indicate whether a value
 * has been set or not, so that we don't leak hashed passwords via API
 *
 * @api public
 */
password.prototype.getData = function (item) {
	return item.get(this.path) ? true : false;
};

/**
 * Formats the field value
 *
 * Password fields are always formatted as a random no. of asterisks,
 * because the saved hash should never be displayed nor the length
 * of the actual password hinted at.
 *
 * @api public
 */
password.prototype.format = function (item) {
	if (!item.get(this.path)) return '';
	var len = Math.round(Math.random() * 4) + 6;
	var stars = '';
	for (var i = 0; i < len; i++) stars += '*';
	return stars;
};

/**
 * Compares
 *
 * @api public
 */
password.prototype.compare = function (item, candidate, callback) {
	if (typeof callback !== 'function') throw new Error('Password.compare() requires a callback function.');
	var value = item.get(this.path);
	if (!value) return callback(null, false);
	bcrypt.compare(candidate, item.get(this.path), callback);
};

/**
 * Asynchronously confirms that the provided password is valid
 */
password.prototype.validateInput = function (data, callback) {
	var detail = '';
	var result = true;
	var min = this.options.min;
	var max = this.options.max || 72;
	var complexity = this.options.complexity;
	var confirmValue = this.getValueFromData(data, '_confirm');
	var passwordValue = this.getValueFromData(data);
	if (confirmValue !== undefined
		&& passwordValue !== confirmValue) {
		detail = 'passwords must match\n';
	}

	if (min && typeof passwordValue === 'string' && passwordValue.length < min) {
		detail += 'password must be longer than ' + min + ' characters\n';
	}

	if (max && typeof passwordValue === 'string' && passwordValue.length > max) {
		detail += 'password must not be longer than ' + max + ' characters\n';
	}

	for (var prop in complexity) {
		if (complexity[prop] && typeof passwordValue === 'string') {
			var complexityCheck = (regexChunk[prop]).test(passwordValue);
			if (!complexityCheck) {
				detail += detailMsg[prop] + '\n';
			}
		}
	}
	result = detail.length === 0;

	utils.defer(callback, result, detail);
};

/**
 * Asynchronously confirms that the provided password is valid
 */
password.prototype.validateRequiredInput = function (item, data, callback) {
	var hashValue = this.getValueFromData(data, '_hash');
	var passwordValue = this.getValueFromData(data);
	var result = hashValue || passwordValue ? true : false;
	if (!result && passwordValue === undefined && hashValue === undefined && item.get(this.path)) result = true;
	utils.defer(callback, result);
};

/**
 * If password fields are required, check that either a value has been
 * provided or already exists in the field.
 *
 * Otherwise, input is always considered valid, as providing an empty
 * value will not change the password.
 *
 * Deprecated
 */
password.prototype.inputIsValid = function (data, required, item) {
	if (data[this.path] && this.paths.confirm in data) {
		return data[this.path] === data[this.paths.confirm] ? true : false;
	}
	if (data[this.path] || data[this.paths.hash] || (item && item.get(this.path))) return true;
	return required ? false : true;
};

/**
 * Updates the value for this field in the item from a data object
 *
 * Will accept either the field path, or paths.hash to bypass bcrypt
 *
 * @api public
 */
password.prototype.updateItem = function (item, data, callback) {
	var hashValue = this.getValueFromData(data, '_hash');
	var passwordValue = this.getValueFromData(data);
	if (passwordValue !== undefined) {
		item.set(this.path, passwordValue);
	} else if (hashValue !== undefined) {
		item.set(this.paths.hash, hashValue);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = password;
