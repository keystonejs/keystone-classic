/**
Deprecated.

Using this field will now throw an error, and this code will be removed soon.

See https://github.com/keystonejs/keystone/wiki/File-Fields-Upgrade-Guide

TODO: this is used by keystone/admin/server/api/s3.js to generate headers, and should be factored out
*/

/* eslint-disable */
var _ = require('lodash');
var assign = require('object-assign');
var loggedWarning = false;

/**
 * S3File FieldType Constructor
 * @extends Field
 * @api public
 */
function s3file (list, path, options) {

	throw new Error('The S3File field type has been removed. Please use File instead.'
		+ '\n\nSee https://github.com/keystonejs/keystone/wiki/File-Fields-Upgrade-Guide\n');

	/*
	grappling.mixin(this).allowHooks('pre:upload');

	this._underscoreMethods = ['format', 'uploadFile'];
	this._fixedSize = 'full';

	// TODO: implement filtering, usage disabled for now
	options.nofilter = true;

	// TODO: implement initial form, usage disabled for now
	if (options.initial) {
		throw new Error('Invalid Configuration\n\n'
			+ 'S3File fields (' + list.key + '.' + path + ') do not currently support being used as initial fields.\n');
	}

	s3file.super_.call(this, list, path, options);

	// validate s3 config (has to happen after super_.call)
	if (!this.s3config) {
		throw new Error('Invalid Configuration\n\n'
			+ 'S3File fields (' + list.key + '.' + path + ') require the "s3 config" option to be set.\n\n'
			+ 'See http://keystonejs.com/docs/configuration/#services-amazons3 for more information.\n');
	}

	// Could be more pre- hooks, just upload for now
	if (options.pre && options.pre.upload) {
		this.pre('upload', options.pre.upload);
	}
	*/

}
s3file.properName = 'S3File';
// util.inherits(s3file, FieldType);

/**
 * Exposes the custom or keystone s3 config settings
 */
Object.defineProperty(s3file.prototype, 's3config', {
	get: function () {
		return this.options.s3config || keystone.get('s3 config');
	},
});

/**
 * Registers the field on the List's Mongoose Schema.
 */
s3file.prototype.addToSchema = function (schema) {

	var knox = require('knox-s3');
	var field = this;

	var paths = this.paths = {
		// fields
		filename: this.path + '.filename',
		originalname: this.path + '.originalname',
		path: this.path + '.path',
		size: this.path + '.size',
		filetype: this.path + '.filetype',
		url: this.path + '.url',
		// virtuals
		exists: this.path + '.exists',
		upload: this.path + '_upload',
		action: this.path + '_action',
	};

	var schemaPaths = this._path.addTo({}, {
		filename: String,
		originalname: String,
		path: String,
		size: Number,
		filetype: String,
		url: String,
	});

	schema.add(schemaPaths);

	var exists = function (item) {
		return (item.get(paths.url) ? true : false);
	};

	// The .exists virtual indicates whether a file is stored
	schema.virtual(paths.exists).get(function () {
		return schemaMethods.exists.apply(this);
	});

	var reset = function (item) {
		item.set(field.path, {
			filename: '',
			originalname: '',
			path: '',
			size: 0,
			filetype: '',
			url: '',
		});
	};

	var schemaMethods = {
		exists: function () {
			return exists(this);
		},
		/**
		 * Resets the value of the field
		 *
		 * @api public
		 */
		reset: function () {
			reset(this);
		},
		/**
		 * Deletes the file from S3File and resets the field
		 *
		 * @api public
		 */
		delete: function () {
			try {
				var client = knox.createClient(field.s3config);
				client.deleteFile(this.get(paths.path) + this.get(paths.filename), function (err, res) { return res ? res.resume() : false; }); // eslint-disable-line handle-callback-err
			} catch (e) {} // eslint-disable-line no-empty
			reset(this);
		},
	};

	_.forEach(schemaMethods, function (fn, key) {
		field.underscoreMethod(key, fn);
	});

	// expose a method on the field to call schema methods
	this.apply = function (item, method) {
		return schemaMethods[method].apply(item, Array.prototype.slice.call(arguments, 2));
	};

	this.bindUnderscoreMethods();
};

/**
 * Formats the field value
 */
s3file.prototype.format = function (item) {
	if (this.hasFormatter()) {
		return this.options.format(item, item[this.path]);
	}
	return item.get(this.paths.url);
};

/**
 * Detects the field have formatter function
 */
s3file.prototype.hasFormatter = function () {
	return typeof this.options.format === 'function';
};

/**
 * Detects whether the field has been modified
 */
s3file.prototype.isModified = function (item) {
	return item.isModified(this.paths.url);
};

/**
 * Validates that a value for this field has been provided in a data object
 *
 * Deprecated
 */
s3file.prototype.inputIsValid = function (data) { // eslint-disable-line no-unused-vars
	// TODO - how should file field input be validated?
	return true;
};

/**
 * Updates the value for this field in the item from a data object
 */
s3file.prototype.updateItem = function (item, data, callback) { // eslint-disable-line no-unused-vars
	// TODO - direct updating of data (not via upload)
	process.nextTick(callback);
};

/**
 * Validates a header option value provided for this item, throwing an error otherwise
 * @param header {Object} the header object to validate
 * @param callback {Function} a callback function to call when validation is complete
 * @return {Boolean}
 */
var validateHeader = function (header, callback) {
	var HEADER_NAME_KEY = 'name';
	var HEADER_VALUE_KEY = 'value';
	var validKeys = [HEADER_NAME_KEY, HEADER_VALUE_KEY];
	var filteredKeys;

	if (!_.has(header, HEADER_NAME_KEY)) {
		return callback(new Error('Unsupported Header option: missing required key "' + HEADER_NAME_KEY + '" in ' + JSON.stringify(header)));
	}
	if (!_.has(header, HEADER_VALUE_KEY)) {
		return callback(new Error('Unsupported Header option: missing required key "' + HEADER_VALUE_KEY + '" in ' + JSON.stringify(header)));
	}

	filteredKeys = _.filter(_.keys(header), function (key) { return _.indexOf(validKeys, key) > -1; });

	_.forEach(filteredKeys, function (key) {
		if (!_.isString(header[key])) {
			return callback(new Error('Unsupported Header option: value for ' + key + ' header must be a String ' + header[key].toString()));
		}
	});

	return true;
};

/**
 * Convenience method to validate a headers object
 * @param headers {Object} the headers object to validate
 * @param callback {Function} a callback function to call when validation is complete
 * @return {Boolean}
 */
var validateHeaders = function (headers, callback) {
	var _headers = [];

	if (!_.isObject(headers)) {
		return callback(new Error('Unsupported Header option: headers must be an Object ' + JSON.stringify(headers)));
	}

	_.forEach(headers, function (value, key) {
		_headers.push({ name: key, value: value });
	});

	_.forEach(_headers, function (header) {
		validateHeader(header, callback);
	});

	return true;
};

/**
 * Generates a headers object for this item to use during upload
 * @param item {Object} the list item
 * @param file {Object} the uploaded file
 * @param callback {Function} a callback function to call when validation is complete
 * @return {Object}
 */
s3file.prototype.generateHeaders = function (item, file, callback) {
	var field = this;
	var filetype = file.mimetype || file.type;
	var headers = {
		'Content-Type': filetype,
		'x-amz-acl': 'public-read',
	};
	var customHeaders = {};
	var headersOption = {};
	var computedHeaders;
	var defaultHeaders;


	if (_.has(field.s3config, 'default headers')) {
		defaultHeaders = field.s3config['default headers'];
		if (_.isArray(defaultHeaders)) {
			_.forEach(defaultHeaders, function (header) {
				var _header = {};
				if (validateHeader(header, callback)) {
					_header[header.name] = header.value;
					customHeaders = assign(customHeaders, _header);
				}
			});
		} else if (_.isObject(defaultHeaders)) {
			customHeaders = assign(customHeaders, defaultHeaders);
		} else {
			return callback(new Error('Unsupported Header option: defaults headers must be either an Object or Array ' + JSON.stringify(defaultHeaders)));
		}
	}

	if (field.options.headers) {
		headersOption = field.options.headers;

		if (_.isFunction(headersOption)) {
			computedHeaders = headersOption.call(field, item, file);

			if (_.isArray(computedHeaders)) {
				_.forEach(computedHeaders, function (header) {
					var _header = {};
					if (validateHeader(header, callback)) {
						_header[header.name] = header.value;
						customHeaders = assign(customHeaders, _header);
					}
				});
			} else if (_.isObject(computedHeaders)) {
				customHeaders = assign(customHeaders, computedHeaders);
			} else {
				return callback(new Error('Unsupported Header option: computed headers must be either an Object or Array ' + JSON.stringify(computedHeaders)));
			}

		} else if (_.isArray(headersOption)) {
			_.forEach(headersOption, function (header) {
				var _header = {};
				if (validateHeader(header, callback)) {
					_header[header.name] = header.value;
					customHeaders = assign(customHeaders, _header);
				}
			});
		} else if (_.isObject(headersOption)) {
			customHeaders = assign(customHeaders, headersOption);
		}
	}

	if (validateHeaders(customHeaders, callback)) {
		headers = assign(headers, customHeaders);
	}

	return headers;

};

/**
 * Uploads the file for this field
 */
s3file.prototype.uploadFile = function (item, file, update, callback) {

	var knox = require('knox-s3');
	var field = this;
	var path = field.options.s3path ? field.options.s3path + '/' : '';
	var prefix = field.options.datePrefix ? moment().format(field.options.datePrefix) + '-' : '';
	var filename = prefix + file.name;
	var originalname = file.originalname;
	var filetype = file.mimetype || file.type;
	var headers;

	if (typeof update === 'function') {
		callback = update;
		update = false;
	}

	if (field.options.allowedTypes && field.options.allowedTypes.indexOf(filetype) === -1) {
		return callback(new Error('Unsupported File Type: ' + filetype));
	}

	var doUpload = function () {

		if (typeof field.options.path === 'function') {
			path = field.options.path(item, path);
		}

		if (typeof field.options.filename === 'function') {
			filename = field.options.filename(item, filename, originalname);
		}

		headers = field.generateHeaders(item, file, callback);

		knox.createClient(field.s3config).putFile(file.path, path + filename, headers, function (err, res) {

			if (err) return callback(err);
			if (res) {
				if (res.statusCode !== 200) {
					return callback(new Error('Amazon returned Http Code: ' + res.statusCode));
				} else {
					res.resume();
				}
			}

			var protocol = (field.s3config.protocol && field.s3config.protocol + ':') || '';
			var url = res.req.url.replace(/^https?:/i, protocol).replace(/%25/g, '%');

			var fileData = {
				filename: filename,
				originalname: originalname,
				path: path,
				size: file.size,
				filetype: filetype,
				url: url,
			};

			if (update) {
				item.set(field.path, fileData);
			}

			callback(null, fileData);

		});
	};

	this.callHook('pre:upload', item, file, function (err) {
		if (err) return callback(err);
		doUpload();
	});

};

/**
 * Returns a callback that handles a standard form submission for the field
 *
 * Expected form parts are
 * - `field.paths.action` in `req.body` (`clear` or `delete`)
 * - `field.paths.upload` in `req.files` (uploads the file to s3file)
 */
s3file.prototype.getRequestHandler = function (item, req, paths, callback) {

	var field = this;

	if (utils.isFunction(paths)) {
		callback = paths;
		paths = field.paths;
	} else if (!paths) {
		paths = field.paths;
	}

	callback = callback || function () {};

	return function () {

		if (req.body) {
			var action = req.body[paths.action];

			if (/^(delete|reset)$/.test(action)) {
				field.apply(item, action);
			}
		}

		if (req.files && req.files[paths.upload] && req.files[paths.upload].size) {
			return field.uploadFile(item, req.files[paths.upload], true, callback);
		}

		return callback();

	};

};

/*!
 * Export class
 */
module.exports = s3file;
