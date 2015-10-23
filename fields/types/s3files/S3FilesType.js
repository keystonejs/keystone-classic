/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	moment = require('moment'),
	keystone = require('../../../'),
	util = require('util'),
	knox = require('knox'),
	// s3 = require('s3'),
	utils = require('keystone-utils'),
	grappling = require('grappling-hook'),
	async = require('async'),
	super_ = require('../Type');

/**
 * S3Files FieldType Constructor
 * @extends Field
 * @api public
 */

function s3files(list, path, options) {
	grappling.mixin(this)
		.allowHooks('pre:upload');
	this._underscoreMethods = ['format', 'uploadFile'];
	this._fixedSize = 'full';

	// TODO: implement filtering, usage disabled for now
	options.nofilter = true;

	// TODO: implement initial form, usage disabled for now
	if (options.initial) {
		throw new Error('Invalid Configuration\n\n' +
			'S3Files fields (' + list.key + '.' + path + ') do not currently support being used as initial fields.\n');
	}

	s3files.super_.call(this, list, path, options);

	// validate s3 config (has to happen after super_.call)
	if (!this.s3config) {
		throw new Error('Invalid Configuration\n\n' +
			'S3Files fields (' + list.key + '.' + path + ') require the "s3 config" option to be set.\n\n' +
			'See http://keystonejs.com/docs/configuration/#services-amazons3 for more information.\n');
	}

	// Could be more pre- hooks, just upload for now
	if (options.pre && options.pre.upload) {
		this.pre('upload', options.pre.upload);
	}

}

/*!
 * Inherit from Field
 */

util.inherits(s3files, super_);

/**
 * Exposes the custom or keystone s3 config settings
 */

Object.defineProperty(s3files.prototype, 's3config', {
	get: function() {
		return this.options.s3config || keystone.get('s3 config');
	}
});


/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */

s3files.prototype.addToSchema = function() {

	var field = this,
		schema = this.list.schema;

	var paths = this.paths = {
		// fields
		filename:   this._path.append('.filename'),
		originalname: this._path.append('.originalname'),
		path:     this._path.append('.path'),
		size:     this._path.append('.size'),
		filetype:   this._path.append('.filetype'),
		url:      this._path.append('.url'),
		// virtuals
		exists:     this._path.append('.exists'),
		upload:     this._path.append('_upload'),
		action:     this._path.append('_action')
	};

	var schemaPaths = this._path.addTo({}, [{
		filename:		String,
		originalname:	String,
		path:			String,
		size:			Number,
		filetype:		String,
		url:			String
	}]);

	schema.add(schemaPaths);

	var exists = function(item, element_id) {
		var values = item.get(field.path);
		var value;

		if (typeof values === 'undefined' || values.length === 0) {
			return false;
		}

		// if current Field contains any file, it means it exists
		if (typeof element_id === 'undefined') {
			value = values[0];
		} else {
			value = _.findWhere(values, { 'id': element_id });
		}

		if (typeof value === 'undefined') {
			return false;
		}

		var filepaths = value.path,
			filename = value.filename;

		return (filename || filepaths);
	};

	// The .exists virtual indicates whether a file is stored
	schema.virtual(paths.exists).get(function() {
		return schemaMethods.exists.apply(this);
	});

	var reset = function(item, element_id) {
		if (typeof element_id === 'undefined') {
			item.set(field.path, []);
		} else {
			var values = item.get(field.path);
			var value = _.findWhere(values, { 'id': element_id });
			if (typeof value !== 'undefined') {
				values.splice(values.indexOf(value), 1);
			}
		}
	};

	var schemaMethods = {
		exists: function() {
			return exists(this);
		},
		/**
		 * Resets the value of the field
		 *
		 * @api public
		 */
		reset: function() {
			reset(this);
		},
		/**
		 * Deletes the file from S3Files and resets the field
		 *
		 * @api public
		 */
		delete: function(element_id) {
			if (!element_id || !exists(this, element_id)) return;
						
			var files = this.get(field.path);
			var file = _.findWhere(files, { 'id': element_id });
			if (typeof file === 'undefined') return;
			
			try {
				var client = knox.createClient(field.s3config);
				client.deleteFile((file.path + file.filename), function(err, res){ return res ? res.resume() : false; });//eslint-disable-line handle-callback-err				
				//client.deleteFile(this.get(paths.path) + this.get(paths.filename), function(err, res){ return res ? res.resume() : false; });//eslint-disable-line handle-callback-err
			} catch(e) {}// eslint-disable-line no-empty
			reset(this, element_id);
		}
	};

	_.each(schemaMethods, function(fn, key) {
		field.underscoreMethod(key, fn);
	});

	// expose a method on the field to call schema methods
	this.apply = function(item, method) {
		return schemaMethods[method].apply(item, Array.prototype.slice.call(arguments, 2));
	};

	this.bindUnderscoreMethods();
};


/**
 * Formats the field value
 *
 * @api public
 */

s3files.prototype.format = function(item) {
	if (this.hasFormatter()) {
		return this.options.format(item, item[this.path]);
	}
	return item.get(this.paths.url);
};


/**
 * Detects the field have formatter function
 *
 * @api public
 */

s3files.prototype.hasFormatter = function() {
	return 'function' === typeof this.options.format;
};


/**
 * Detects whether the field has been modified
 *
 * @api public
 */

s3files.prototype.isModified = function(item) {
	return item.isModified(this.paths.url);
};


/**
 * Validates that a value for this field has been provided in a data object
 *
 * @api public
 */

s3files.prototype.validateInput = function(data) {//eslint-disable-line no-unused-vars
	// TODO - how should file field input be validated?
	return true;
};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

s3files.prototype.updateItem = function(item, data) {//eslint-disable-line no-unused-vars
	// TODO - direct updating of data (not via upload)
};


/**
 * Validates a header option value provided for this item, throwing an error otherwise
 * @param header {Object} the header object to validate
 * @param callback {Function} a callback function to call when validation is complete
 * @return {Boolean}
 * @api private
 */

var validateHeader = function(header, callback) {
	var HEADER_NAME_KEY = 'name',
		HEADER_VALUE_KEY = 'value',
		validKeys = [HEADER_NAME_KEY, HEADER_VALUE_KEY],
		filteredKeys;

	if (!_.has(header, HEADER_NAME_KEY)){
		return callback(new Error('Unsupported Header option: missing required key "' + HEADER_NAME_KEY + '" in ' + JSON.stringify(header)));
	}
	if (!_.has(header, HEADER_VALUE_KEY)){
		return callback(new Error('Unsupported Header option: missing required key "' + HEADER_VALUE_KEY + '" in ' + JSON.stringify(header)));
	}

	filteredKeys = _.filter(_.keys(header), function (key){ return _.indexOf(validKeys, key) > -1; });

	_.each(filteredKeys, function (key){
		if (!_.isString(header[key])){
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
 * @api private
 */

var validateHeaders = function(headers, callback) {
	var _headers = [];

	if (!_.isObject(headers)){
		return callback(new Error('Unsupported Header option: headers must be an Object ' + JSON.stringify(headers)));
	}

	_.each(headers, function (value, key){
		_headers.push({ name: key, value: value });
	});

	_.each(_headers, function (header){
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
 * @api public
 */

s3files.prototype.generateHeaders = function (item, file, callback){
	var field = this,
		filetype = file.mimetype || file.type,
		headers = {
			'Content-Type': filetype,
			'x-amz-acl': 'public-read'
		},
		customHeaders = {},
		headersOption = {},
		computedHeaders,
		defaultHeaders;


	if (_.has(field.s3config, 'default headers')){
		defaultHeaders = field.s3config['default headers'];
		if (_.isArray(defaultHeaders)){
			_.each(defaultHeaders, function (header){
				var _header = {};
				if (validateHeader(header, callback)){
					_header[header.name] = header.value;
					customHeaders = _.extend(customHeaders, _header);
				}
			});
		} else if (_.isObject(defaultHeaders)){
			customHeaders = _.extend(customHeaders, defaultHeaders);
		} else {
			return callback(new Error('Unsupported Header option: defaults headers must be either an Object or Array ' + JSON.stringify(defaultHeaders)));
		}
	}

	if (field.options.headers){
		headersOption = field.options.headers;

		if (_.isFunction(headersOption)){
			computedHeaders = headersOption.call(field, item, file);

			if (_.isArray(computedHeaders)){
				_.each(computedHeaders, function (header){
					var _header = {};
					if (validateHeader(header, callback)){
						_header[header.name] = header.value;
						customHeaders = _.extend(customHeaders, _header);
					}
				});
			} else if (_.isObject(computedHeaders)){
				customHeaders = _.extend(customHeaders, computedHeaders);
			} else {
				return callback(new Error('Unsupported Header option: computed headers must be either an Object or Array ' + JSON.stringify(computedHeaders)));
			}

		} else if (_.isArray(headersOption)){
			_.each(headersOption, function (header){
				var _header = {};
				if (validateHeader(header, callback)){
					_header[header.name] = header.value;
					customHeaders = _.extend(customHeaders, _header);
				}
			});
		} else if (_.isObject(headersOption)){
			customHeaders = _.extend(customHeaders, headersOption);
		}
	}

	if (validateHeaders(customHeaders, callback)){
		headers = _.extend(headers, customHeaders);
	}

	return headers;

};



/**
 * Uploads the file for this field
 *
 * @api private
 */

s3files.prototype.uploadFile = function(item, file, update, callback) {

	var field = this,
		path = field.options.s3path ? field.options.s3path + '/' : '',
		prefix = field.options.datePrefix ? moment().format(field.options.datePrefix) + '-' : '',
		filename = prefix + file.name,
		originalname = file.originalname,
		filetype = file.mimetype || file.type,
		headers;

	if ('function' === typeof update) {
		callback = update;
		update = false;
	}

	if (field.options.allowedTypes && !_.contains(field.options.allowedTypes, filetype)) {
		return callback(new Error('Unsupported File Type: ' + filetype));
	}
	
	if ('function' === typeof field.options.path) {
		path = field.options.path(item, path);
	}

	if ('function' === typeof field.options.filename) {
		filename = field.options.filename(item, filename, originalname);
	}

	headers = field.generateHeaders(item, file, callback);

	knox.createClient(field.s3config).putFile(file.path, path + filename, headers, function(err, res) {

		if (err) return callback(err);
		if (res) {
			if (res.statusCode !== 200) {
				return callback(new Error('Amazon returned Http Code: ' + res.statusCode));
			} else {
				res.resume();
			}
		}

		var protocol = (field.s3config.protocol && field.s3config.protocol + ':') || '',
			url = res.req.url.replace(/^https?:/i, protocol);

		var fileData = {
			filename: filename,
			originalname: originalname,
			path: path,
			size: file.size,
			filetype: filetype,
			url: url
		};

		if (update) {
			item.get(field.path).push(fileData);
		}

		callback(null, fileData);

	});
};


/**
 * Uploads mutliple files for this field
 *
 * @api public
 */

s3files.prototype.uploadFiles = function(item, files, update, callback) {	

	var field = this;
	
	if ('function' === typeof update && !callback) {
		callback = update;
		update = false;
	}
	
	this.callHook('pre:upload', [item, files], function(err) {
		if (err) return callback(err);
				
		async.map(files, function(file, processedFile) {
			field.uploadFile(item, file, update, processedFile);
		}, callback);
	});
};


/**
 * Returns a callback that handles a standard form submission for the field
 *
 * Expected form parts are
 * - `field.paths.action` in `req.body` (`clear` or `delete`)
 * - `field.paths.upload` in `req.files` (uploads the file to s3files)
 *
 * @api public
 */

s3files.prototype.getRequestHandler = function(item, req, paths, callback) {

	var field = this;

	if (utils.isFunction(paths)) {
		callback = paths;
		paths = field.paths;
	} else if (!paths) {
		paths = field.paths;
	}

	callback = callback || function() {};

	return function() {

		// Removals
		if (req.body && req.body[paths.action]) {
			var actions = req.body[paths.action].split('|');

			actions.forEach(function(action) {

				action = action.split(':');

				var method = action[0],
					ids = action[1];

				if (!(/^(delete|reset)$/.test(method)) || !ids) return;

				ids.split(',').forEach(function(id) {
					field.apply(item, method, id);
				});

			});
		}
		
		if (!req.files || !req.files[paths.upload]) return callback();
		
		var upFiles = req.files[paths.upload];
		if (!Array.isArray(upFiles)) {
			upFiles = [upFiles];
		}
		
		if (_.isEmpty(upFiles)) return callback();
		
		upFiles = _.filter(upFiles, function(f) { return typeof f.name !== 'undefined' && f.name.length > 0 && f.size > 0; });

		if (upFiles.length > 0) {
			console.log('uploading files:');
			console.log(upFiles);
			return field.uploadFiles(item, upFiles, true, callback);
		}

		return callback();

	};

};


/**
 * Immediately handles a standard form submission for the field (see `getRequestHandler()`)
 *
 * @api public
 */

s3files.prototype.handleRequest = function(item, req, paths, callback) {
	this.getRequestHandler(item, req, paths, callback)();
};


/*!
 * Export class
 */

exports = module.exports = s3files;
