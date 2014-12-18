/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	util = require('util'),
	bcrypt = require('bcrypt-nodejs'),
	super_ = require('../field');

/**
 * password FieldType Constructor
 * @extends Field
 * @api public
 */

function password(list, path, options) {
	this.workFactor = options.workFactor || 10;
	this._nativeType = String;
	this._underscoreMethods = ['format', 'compare'];
	options.nosort = true; // You can't sort on password fields
	// TODO: implement filtering, hard-coded as disabled for now
	options.nofilter = true;
	password.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(password, super_);

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * Adds ...
 *
 * @api public
 */
password.prototype.addToSchema = function() {

	var field = this,
		schema = this.list.schema;
	
	var needs_hashing = '__' + field.path + '_needs_hashing';

	this.paths = {
		hash: this.options.hashPath || this._path.append('_hash'),
		confirm: this.options.confirmPath || this._path.append('_confirm')
	};

	schema.path(this.path, _.defaults({
		type: String,
		set: function(newValue) {
			this[needs_hashing] = true;
			return newValue;
		}
	}, this.options));
	
	schema.virtual(this.paths.hash).set(function(newValue) {
		this.set(field.path, newValue);
		this[needs_hashing] = false;
	});

	schema.pre('save', function(next) {
		
		if (!this.isModified(field.path) || !this[needs_hashing]) {
			return next();
		}

		if (!this.get(field.path)) {
			this.set(field.path, undefined);
			return next();
		}

		var item = this;

		bcrypt.genSalt(field.workFactor, function(err, salt) {
			if (err)
				return next(err);

			bcrypt.hash(item.get(field.path), salt, function () {}, function(err, hash) {
				if (err)
					return next(err);

				// override the cleartext password with the hashed one
				item.set(field.path, hash);
				next();
			});
		});

	});

	this.bindUnderscoreMethods();

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

password.prototype.format = function(item) {
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

password.prototype.compare = function(item, candidate, callback) {
	if ('function' !== typeof callback) throw new Error('Password.compare() requires a callback function.');
	var value = item.get(this.path);
	if (!value) return callback(null, false);
	bcrypt.compare(candidate, item.get(this.path), callback);
};


/**
 * If password fields are required, check that either a value has been
 * provided or already exists in the field.
 *
 * Otherwise, input is always considered valid, as providing an empty
 * value will not change the password.
 *
 * @api public
 */

password.prototype.validateInput = function(data, required, item) {
	if (data[this.path] && this.paths.confirm in data) {
		return data[this.path] === data[this.paths.confirm] ? true : false
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

password.prototype.updateItem = function(item, data) {
	if (this.path in data) {
		item.set(this.path, data[this.path]);
	} else if (this.paths.hash in data) {
		item.set(this.paths.hash, data[this.paths.hash]);
	}
};


/*!
 * Export class
 */

exports = module.exports = password;
