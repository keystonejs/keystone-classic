var keystone = require('../../../');

var StorageAdapter = require('../StorageAdapter'),
	util = require('util'),
	path = require('path'),
	_ = require('underscore'),
	knox = require('knox');

function s3file() {
	StorageAdapter.apply(this, arguments);
	
	if(! this.s3config){
		throw new Error('Invalid Configuration\n\n' +
			'S3s stores require the "s3 config" option to be set.\n\n' +
			'See http://keystonejs.com/docs/configuration/#services-amazons3 for more information.\n');
		
	}
}

util.inherits(s3file, StorageAdapter);

/**
* Exposes the custom or keystone s3 config settings
*/

Object.defineProperty(s3file.prototype, 's3config', { get: function() {
	return this.options.s3config || keystone.get('s3 config');
}});

s3file.prototype.getPaths = function(basePaths) {
	return _.defaults({
		url : String
	}, basePaths);
};

s3file.prototype.fileExists = function(item, paths){
	return (item.get(paths.url) ? true : false);
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

	filteredKeys = _.filter(_.keys(header), function (key){ return _.indexOf(validKeys, key) > -1 });

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

s3file.prototype.generateHeaders = function (item, file, callback) {
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
 * @api public
 */

s3file.prototype.uploadFile = function(field, item, file, callback) {
	var self = this,
		options = _.defaults({}, field.options, this.options),
		filename = this.normaliseFilename(item, file, options),
		path = field.options.s3path ? field.options.s3path + '/' : '',
		filetype = file.mimetype || file.type,
		s3config = _.defaults({}, field.s3config, this.s3config),
		headers;

	headers = this.generateHeaders(item, file, callback);

	knox.createClient(this.s3config).putFile(file.path, path + filename, headers, function(err, res) {
		if (err) return callback(err);
		if (res) {
			if (res.statusCode !== 200) {
				return callback(new Error('Amazon returned Http Code: ' + res.statusCode));
			} else {
				res.resume();
			}
		}

		var protocol = s3config.protocol || '',
			url = res.req.url.replace(/^https?:/i, protocol);

		var fileData = {
			filename: filename,
			originalname: file.originalname,
			path: path,
			size: file.size,
			filetype: filetype,
			url: url
		};
		callback(null, fileData);

	});
};
module.exports = s3file;
