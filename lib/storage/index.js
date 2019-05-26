var assign = require('object-assign');
var fs = require('fs-extra');
var path = require('path');
var mime = require('mime-types');
var nameFunctions = require('keystone-storage-namefunctions');

var debug = require('debug')('keystone:storage:adapter:fs');

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

	Storage Adapters can specify additional schema properties.
*/
var SCHEMA_TYPES = {
//	filename: String, // the filename, without the full path
	size: Number, // the size of the file
	mimetype: String, // the mime type of the file
	path: String, // the path (e.g directory) the file is stored in; not the full path to the file
	originalname: String, // the original (uploaded) name of the file; useful when filename generated
	url: String, // publicly accessible URL of the stored file
};

/**
	This is the default set of schema fields that are enabled. The storage
	options can override these (must be supported by the adapter, or the
	adapter must use the default schema implementation)
*/
var SCHEMA_FIELD_DEFAULTS = {
//	filename: true,
	size: true,
	mimetype: true,
	path: false,
	originalname: false,
	url: false,
};

// TODO: We could support custom schema mappings for backwards compatibilty
// with Keystone 0.3 or imported schamas... not sure if it's worth it though.

/**
	# Storage Prototype

	Creates a new Keystone Storage instance, and validates and initialises the
	specified adapter. Storage schema is configured from the adapter or default.
*/
function Storage (options) {
	// we're going to mutate options so get a clean copy of it
	options = assign({}, options);

	var AdapterType = options.adapter;
	delete options.adapter;

	if (typeof AdapterType !== 'function') {
		throw new Error('Invalid Storage Adapter\n'
			+ 'The storage adapter specified is not a function. Did you '
			+ 'require the right package?\n');
	}

	debug('Initialising Storage with adapter ' + AdapterType.name);

	// ensure the adapter compatibilityLevel of the adapter matches
	if (AdapterType.compatibilityLevel !== ADAPTER_COMPATIBILITY_LEVEL) {
		throw new Error('Incompatible Storage Adapter\n'
			+ 'The storage adapter specified (' + AdapterType.name + ') '
			+ 'does not match the compatibility level required for this '
			+ 'version of Keystone.\n');
	}

	// assign ensures the default schema constant isn't exposed as a property
	var schemaFields = assign({}, SCHEMA_FIELD_DEFAULTS, AdapterType.SCHEMA_FIELD_DEFAULTS, options.schema);
	delete options.schema;

	// Copy requested fields into local schema.
	var schema = this.schema = {};
	for (var path in schemaFields) {
		if (!schemaFields[path]) continue;

		var type = AdapterType.SCHEMA_TYPES[path] || SCHEMA_TYPES[path];
		if (!type) throw Error('Unknown type for requested schema field ' + path);
		schema[path] = type;
	}

	// ensure Storage schema features are supported by the Adapter
	if (schema.url && typeof AdapterType.prototype.getFileURL !== 'function') {
		throw Error('URL schema field is not supported by the ' + AdapterType.name + ' adapter');
	}

	// create the adapter
	this.adapter = new AdapterType(options, schema);
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

	// Ensure a file object has been provided
	if (!file) return callback(Error('Cannot upload file - No file object provided'));

	// The path to the file is required
	if (!file.path) return callback(Error('Cannot upload file - No source path'));

	normalizeFile(file, this.schema, function (err, file) {
		if (err) return callback(err);
		self.adapter.uploadFile(file, function (err, result) {
			if (err) return callback(err);
			if (self.schema.url && self.adapter.getFileURL) {
				result.url = self.adapter.getFileURL(result);
			}
			callback(null, result);
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
assign(Storage, nameFunctions);


module.exports = Storage;
