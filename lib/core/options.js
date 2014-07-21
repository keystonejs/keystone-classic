var path = require('path'),
	_ = require('underscore'),
	cloudinary = require('cloudinary'),
	mandrillapi = require('mandrill-api'),
	utils = require('keystone-utils');

function options(moduleRoot) {
	
	var exports = {};

	/**
	 * This file contains methods specific to dealing with Keystone's options.
	 * All exports are added to the Keystone.prototype
	 */

	// Deprecated options that have been mapped to new keys
	var remappedOptions = {
		'signin success': 'signin redirect',
		'signout': 'signout url'
	};

	/**
	 * Sets keystone options
	 *
	 * ####Example:
	 *
	 *     keystone.set('user model', 'User') // sets the 'user model' option to `User`
	 *
	 * @param {String} key
	 * @param {String} value
	 * @api public
	 */
	exports.set = function(key, value) {
	 	
		if (arguments.length === 1) {
			return this._options[key];
		}
		
		if (remappedOptions[key]) {
			if (this.get('logger')) {
				console.log('\nWarning: the `' + key + '` option has been deprecated. Please use `' + remappedOptions[key] + '` instead.\n\n' +
					'Support for `' + key + '` will be removed in a future version.');
			}
			key = remappedOptions[key];
		}
		
		// handle special settings
		switch (key) {
			case 'cloudinary config':
				if (_.isObject(value)) {
					cloudinary.config(value);
				}
				value = cloudinary.config();
			break;
			case 'mandrill api key':
				if (value) {
					this.mandrillAPI = new mandrillapi.Mandrill(value);
				}
			break;
			case 'auth':
				if (value === true && !this.get('session')) {
					this.set('session', true);
				}
			break;
			case 'nav':
				this.nav = this.initNav(value);
			break;
			case 'mongo':
				if ('string' !== typeof value) {
					if (Array.isArray(value) && (value.length === 2 || value.length === 3)) {
						console.log('\nWarning: using an array for the `mongo` option has been deprecated.\nPlease use a mongodb connection string, e.g. mongodb://localhost/db_name instead.\n\n' +
							'Support for arrays as the `mongo` setting will be removed in a future version.');
						value = (value.length === 2) ? 'mongodb://' + value[0] + '/' + value[1] : 'mongodb://' + value[0] + ':' + value[2] + '/' + value[1];
					} else {
						console.error('\nInvalid Configuration:\nThe `mongo` option must be a mongodb connection string, e.g. mongodb://localhost/db_name\n');
						process.exit(1);
					}
				}
			break;
		}
		
		this._options[key] = value;
		return this;
	};


	/**
	 * Sets multiple keystone options.
	 *
	 * ####Example:
	 *
	 *     keystone.set({test: value}) // sets the 'test' option to `value`
	 *
	 * @param {Object} options
	 * @api public
	 */

	exports.options = function(options) {
		if (!arguments.length)
			return this._options;
		if (utils.isObject(options)) {
			var keys = Object.keys(options),
				i = keys.length,
				k;
			while (i--) {
				k = keys[i];
				this.set(k, options[k]);
			}
		}
		return this._options;
	};


	/**
	 * Gets keystone options
	 *
	 * ####Example:
	 *
	 *     keystone.get('test') // returns the 'test' value
	 *
	 * @param {String} key
	 * @api public
	 */

	exports.get = exports.set;

	/**
	 * Gets an expanded path option, expanded to include moduleRoot if it is relative
	 *
	 * ####Example:
	 *
	 *     keystone.get('pathOption', 'defaultValue')
	 *
	 * @param {String} key
	 * @param {String} defaultValue
	 * @api public
	 */

	exports.getPath = function(key, defaultValue) {
		return this.expandPath(this.get(key) || defaultValue);
	};

	/**
	 * Expands a path to include moduleRoot if it is relative
	 *
	 * @param {String} pathValue
	 * @api public
	 */

	exports.expandPath = function(pathValue) {
		pathValue = ('string' === typeof pathValue && pathValue.substr(0,1) !== path.sep && pathValue.substr(1,2) !== ':\\')
			? path.join(moduleRoot, pathValue)
			: pathValue;
		return pathValue;
	};
	
	return exports;
	
};

module.exports = options;
