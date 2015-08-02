var _ = require('underscore');
var callerId = require('caller-id');
var cloudinary = require('cloudinary');
var debug = require('debug')('keystone:core:options');
var mandrillapi = require('mandrill-api');
var path = require('path');
var url = require('url');
var utils = require('keystone-utils');

function options() {
	
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

	// Determines if path is absolute or relative
	function isAbsolutePath(value) {
		return path.resolve(value) === path.normalize(value).replace(new RegExp(path.sep + '$'), '');
	}

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

		switch (key) {
			// warn on deprecated/old/invalid settings
			case 'less middleware options':
			case 'less parser options':
			case 'less compiler options':
				if (this.get('logger')) {
					console.log('\nWarning: less-middleware has changed the way it handles options, and ' +
						'\n`' + key + '` is no longer supported. You should simply use `less options` now;' +
						'\nsee https://github.com/emberfeather/less.js-middleware for details.');
				}
			break;

			// handle special settings
			case 'cloudinary config':
				if (_.isString(value)) {
					var parts = url.parse(value, true);
					var auth = parts.auth ? parts.auth.split(':') : [];
					value = {
						cloud_name: parts.host,
						api_key: auth[0],
						api_secret: auth[1],
						private_cdn: parts.pathname != null,
						secure_distribution: parts.pathname && parts.pathname.substring(1)
					};
				}
				if (_.isObject(value)) {
					cloudinary.config(value);
				}
				value = cloudinary.config();
			break;
			case 'mandrill api key':
				if (value) {
					debug('found mandril key');
					this.mandrillAPI = new mandrillapi.Mandrill(value);
				}
			break;
			case 'auth':
				if (value === true && !this.get('session')) {
					debug('setting session for auth');
					this.set('session', true);
				}
			break;
			case 'nav':
				debug('setting nav');
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
			case 'module root':
				// if relative path is used, resolve it based on the caller's path
				if (!isAbsolutePath(value)) {
					var caller = callerId.getData();
					value = path.resolve(path.dirname(caller.filePath), value);
				}
			break;
			case 'app':
				this.app = value;
			break;
			case 'mongoose':
				this.mongoose = value;
			break;
			case 'frame guard':
				var validFrameGuardOptions = ['deny', 'sameorigin'];

				if (value === true) {
					value = 'deny';
				}
				if (utils.isString(value)) {
					value = value.toLowerCase();
					if (validFrameGuardOptions.indexOf(value) < 0) {
						value = false;
					}
				} else if ('boolean' !== typeof value) {
					value = false;
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
	 *     keystone.options({test: value}) // sets the 'test' option to `value`
	 *
	 * @param {Object} options
	 * @api public
	 */

	exports.options = function(options) {
		if (!arguments.length) {
			return this._options;
		}
		if (utils.isObject(options)) {
			debug('settings options');
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
		pathValue = ('string' === typeof pathValue && pathValue.substr(0, 1) !== path.sep && pathValue.substr(1, 2) !== ':\\')
			? path.join(this.get('module root'), pathValue)
			: pathValue;
		return pathValue;
	};
	
	return exports;
	
}

module.exports = options;
