var assign = require('object-assign');
var fs = require('fs-extra');
var path = require('path');
var mime = require('mime-types');
var nameFunctions = require('./nameFunctions');

/**
	The Adapter Compatibility Level is used to ensure that provided adapters
	have been designed to work with the version of Storage implemented in the
	version of Keystone being used.

	The Adapter Compatibility Level must be an exact match or an error will be
	thrown when the Storage instance is initialised.
*/
var ADAPTER_COMPATIBILITY_LEVEL = 1;

/**
	This is the default storage schema for file fields. These paths will be
	persisted to the database and represent the value of the file field.

	Storage Adapters can specify their own schema properties but must implement
	the required schema fields (see array below).
*/
var SCHEMA_TYPES = {
	// filename: String,		// the filename, without the full path
	size: Number,		// the size of the file
	mimetype: String,		// the mime type of the file
	path: String,		// the path (e.g directory) the file is stored in; not the full path to the file
	originalname: String,	// the original (uploaded) name of the file; useful when filename generated
	url: String,			// publicly accessible URL of the stored file


	// bucket: String,
};

/**
	This is the default set of schema fields that are enabled. The storage
	options can override these (must be supported by the adapter, or the
	adapter must use the default schema implementation)
*/
var SCHEMA_FIELD_DEFAULTS = {
	// filename: true,
	size: true,
	mimetype: true,
	// path: false,
	// originalname: false,
	// url: false,

	// etag: false,

};

/**
	These schema paths _must_ be included in a schema, as they're expected
	by the Admin UI
*/
// var REQUIRED_SCHEMA_FIELDS = ['filename'];

// TODO: We could support custom schema mappings for backwards compatibilty
// with Keystone 3 or imported schamas... not sure if it's worth it though.

var DEFAULT_OPTIONS = {
	generateFilename: nameFunctions.randomFilename,
	whenExists: 'overwrite',
	retryAttempts: 3, // For whenExists: 'retry'.
};

/**
	# Storage Prototype

	Creates a new Keystone Storage instance, and validates and initialises the
	specified adapter. Storage schema is configured from the adapter or default.
*/
function Storage (options) {
	this.options = options = assign({}, DEFAULT_OPTIONS, options);
	// ensure the adapter compatibilityLevel of the adapter matches
	if (options.adapter.compatibilityLevel !== ADAPTER_COMPATIBILITY_LEVEL) {
		throw new Error('Incompatible Storage Adapter\n\n'
			+ 'The storage adapter specified (' + options.adapter.name + ') '
			+ 'does not match the compatibility level required for this '
			+ 'version of Keystone.');
	}

	var adapterType = options.adapter;
	// assign ensures the default schema constant isn't exposed as a property
	var schemaFields = assign({}, SCHEMA_FIELD_DEFAULTS, adapterType.SCHEMA_FIELD_DEFAULTS, options.schema);

	// Copy requested fields into local schema.
	var schema = this.schema = {};
	for (var path in schemaFields) {
		if (!schemaFields[path]) continue;

		var type = adapterType.SCHEMA_TYPES[path] || SCHEMA_TYPES[path];
		if (!type) throw Error('Unknown type for requested schema field ' + path);
		schema[path] = type;
	}

	// create the adapter
	this.adapter = new options.adapter(options, schema);

	if (!this.adapter.fileExists && (options.whenExists === 'retry' || options.whenExists === 'error')) {
		throw Error('Cannot use whenExists option `' + options.whenExists + '`'
			+ ' with file adapter as it does not implement optional .fileExists method');
	}

	// The generateFilename option takes an optional callback. Wrap it to always
	// take a callback.
	if (options.generateFilename.length <= 2) { // (file) or (file, attempt)
		// If generateFilename throws I'll take that as a runtime error and not
		// a file data error. If you need to pass errors upstream take a
		// callback.
		var original = options.generateFilename;
		options.generateFilename = function (file, attempt, callback) {
			callback(null, original(file, attempt));
		};
	}
}

// Helper function for figuring out the size of a file before uploading it.
function getSize (file, callback) {
	if (file.size) return callback(null, file.size);

	fs.stat(file.path, function (err, stats) {
		if (!stats.isFile()) {
			return callback(Error(file.path + ' is not a file'));
		}

		callback(err, stats ? stats.size : null);
	});
}

// Helper to attempt an async process `maxAttempts` times. Used to find a valid
// name for the uploaded file.
function attemptNTimes (maxAttempts, fn, callback) {
	function _attemptNTimes (attempt) {
		if (attempt >= maxAttempts) return callback(Error('Maximum attempts exceeded'));

		fn(attempt, function (err, isDone, data) {
			if (err) return callback(err);
			if (isDone) return callback(null, data);
			_attemptNTimes(attempt + 1);
		});
	}

	_attemptNTimes(0);
}

Storage.prototype._genFilename = function (file, callback) {
	var options = this.options;
	var adapter = this.adapter;
	switch (options.whenExists) {
		case 'overwrite':
			options.generateFilename(file, 0, callback);
			break;
		case 'error':
			options.generateFilename(file, 0, function (err, filename) {
				if (err) return callback(err);
				adapter.fileExists(filename, function (err, result) {
					if (err) return callback(err);
					if (result === true) return callback(Error('File already exists'));
					callback(null, filename);
				});
			});
			break;
		case 'retry':
			attemptNTimes(options.retryAttempts, function (num, next) {
				options.generateFilename(file, num, function (err, filename) {
					if (err) return next(err);
					self.adapter.fileExists(filename, function (err, exists) {
						next(err, !err && !exists);
					});
				});
			}, callback);
	}
};

// Helper to fill out missing fields in the file object
function normalizeFile (file, schema, callback) {
	// Detect required information if it wasn't provided by inspecting the
	// file stored at file.path
	if (schema.mimetype && !file.mimetype) file.mimetype = mime(file.path);

	if (!file.originalname) {
		file.originalname = file.name
			|| (file.path) ? path.parse(file.path).base : 'unnamedfile';
	}

	if (schema.size && !file.size) {
		getSize(file, function (err, size) {
			if (err) return callback(err);
			file.size = size;
			callback(null, file);
		});
	} else callback(null, file);
}

/**
	Uploads a new file via the adapter, then decorates the result with the
	public url for the file. The result is what is saved back to the field.
*/
Storage.prototype.uploadFile = function (file, callback) {
	var self = this;

	// The path to the file is required
	if (!file.path) return callback(Error('Cannot upload file - No source path'));

	normalizeFile(file, this.schema, function (err, file) {
		if (err) return callback(err);
		self._genFilename(file, function (err, filename) {
			if (err) return callback(err);

			self.adapter.uploadFile(filename, file, function (err, result) {
				if (err) return callback(err);
				result.url = self.adapter.getFileURL(result);

				callback(null, result);
			});
		});
	});
};

/**
	Removes a stored file by passing the field value to the adapter.
*/
Storage.prototype.removeFile = function (value, callback) {
	this.adapter.removeFile(value, callback);
};

/*
	Built-in Adapters
*/
Storage.Adapters = {};
Storage.Adapters.FS = require('./adapters/fs');
Storage.nameFunctions = nameFunctions;


module.exports = Storage;
