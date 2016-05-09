var callerId = require('caller-id');
var path = require('path');
var url = require('url');

/**
 * This file contains methods specific to dealing with Keystone's options.
 * All exports are added to the Keystone.prototype
 */

// Determines if path is absolute or relative
function isAbsolutePath (value) {
	return path.resolve(value) === path.normalize(value).replace(new RegExp(path.sep + '$'), '');
}

/**
 * Sets keystone options
 *
 * Example:
 *     keystone.set('user model', 'User') // sets the 'user model' option to `User`
 */
exports.set = function (key, value) {

	if (arguments.length === 1) {
		return this._options[key];
	}

	switch (key) {
		// throw on unsupported options
		case 'email rules':
			throw new Error('The option "' + key + '" is no longer supported. See https://github.com/keystonejs/keystone/wiki/0.3.x-to-0.4.x-Changes');
		// handle special settings
		case 'cloudinary config':
			var cloudinary = require('cloudinary');
			if (typeof value === 'string') {
				var parts = url.parse(value, true);
				var auth = parts.auth ? parts.auth.split(':') : [];
				value = {
					cloud_name: parts.host,
					api_key: auth[0],
					api_secret: auth[1],
					private_cdn: parts.pathname != null,
					secure_distribution: parts.pathname && parts.pathname.substring(1),
				};
			}
			cloudinary.config(value);
			value = cloudinary.config();
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
			if (typeof value !== 'string') {
				if (Array.isArray(value) && (value.length === 2 || value.length === 3)) {
					console.log('\nWarning: using an array for the `mongo` option has been deprecated.\nPlease use a mongodb connection string, e.g. mongodb://localhost/db_name instead.\n\n'
					+ 'Support for arrays as the `mongo` setting will be removed in a future version.');
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
			if (typeof value === 'string') {
				value = value.toLowerCase();
				if (validFrameGuardOptions.indexOf(value) < 0) {
					value = false;
				}
			} else if (typeof value !== 'boolean') {
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
 * Example:
 *     keystone.options({test: value}) // sets the 'test' option to `value`
 */
exports.options = function (options) {
	if (!arguments.length) {
		return this._options;
	}
	if (typeof options === 'object') {
		var keys = Object.keys(options);
		var i = keys.length;
		var k;
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
 * Example:
 *     keystone.get('test') // returns the 'test' value
 */
exports.get = exports.set;

/**
 * Gets an expanded path option, expanded to include moduleRoot if it is relative
 *
 * Example:
 *     keystone.get('pathOption', 'defaultValue')
 */
exports.getPath = function (key, defaultValue) {
	return this.expandPath(this.get(key) || defaultValue);
};

/**
 * Expands a path to include moduleRoot if it is relative
 */
exports.expandPath = function (pathValue) {
	pathValue = (typeof pathValue === 'string' && pathValue.substr(0, 1) !== path.sep && pathValue.substr(1, 2) !== ':\\')
		? path.join(this.get('module root'), pathValue)
		: pathValue;
	return pathValue;
};
