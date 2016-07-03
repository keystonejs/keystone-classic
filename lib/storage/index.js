var assign = require('object-assign');
var fs = require('fs-extra');
var path = require('path');
var mime = require('mime-types');

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
var DEFAULT_SCHEMA_TYPES = {
	filename: String,		// the filename, without the full path
	filesize: Number,		// the size of the file
	filetype: String,		// the mime type of the file
	filepath: String,		// the path (e.g directory) the file is stored in; not the full path to the file
	originalname: String,	// the original (uploaded) name of the file; useful when filename generated
	url: String,			// publicly accessible URL of the stored file
};

/**
	This is the default set of schema fields that are enabled. The storage
	options can override these (must be supported by the adapter, or the
	adapter must use the default schema implementation)
*/
var DEFAULT_SCHEMA_FIELDS = {
	filename: true,
	filesize: true,
	filetype: true,
	filepath: false,
	originalname: false,
	url: true,
};

/**
	These schema paths _must_ be included in a schema, as they're expected
	by the Admin UI
*/
var REQUIRED_SCHEMA_FIELDS = ['filename', 'filesize'];

// TODO: We could support custom schema mappings for backwards compatibilty
// with Keystone 3 or imported schamas... not sure if it's worth it though.

/**
	# Storage Prototype

	Creates a new Keystone Storage instance, and validates and initialises the
	specified adapter. Storage schema is configured from the adapter or default.
*/
function Storage (options) {
	this.options = options;
	// ensure the adapter compatibilityLevel of the adapter matches
	if (options.adapter.compatibilityLevel !== ADAPTER_COMPATIBILITY_LEVEL) {
		throw new Error('Incompatible Storage Adapter\n\n'
			+ 'The storage adapter specified (' + options.adapter.name + ') '
			+ 'does not match the compatibility level required for this '
			+ 'version of Keystone.');
	}
	// create the adapter
	this.adapter = new options.adapter(options);
	// assign ensures the default schema constant isn't exposed as a property
	var schema = this.schema = this.adapter.schema || assign({}, DEFAULT_SCHEMA_TYPES);
	// allow the options to override the default schema fields that will be included
	var includedSchemaPaths = assign({}, this.adapter.schemaFields || DEFAULT_SCHEMA_FIELDS, options.schema || {});
	// ensure all the required schema paths have been included
	REQUIRED_SCHEMA_FIELDS.forEach(function (path) {
		if (!includedSchemaPaths[path]) {
			throw new Error('Invalid Storage Schema Configuration\n\n'
				+ 'The path ' + path + ' must be included in the storage schema. If '
				+ 'you haven\'t modified the schema option, this may be an issue '
				+ 'with the Storage adapter.');
		}
	});
	// remove any paths from the schema that aren't included
	Object.keys(schema).forEach(function (path) {
		if (schema.hasOwnProperty(path) && !includedSchemaPaths[path]) {
			delete schema[path];
		}
	});
}

/**
	Uploads a new file via the adapter, then decorates the result with the
	public url for the file. The result is what is saved back to the field.
*/
Storage.prototype.uploadFile = function (file, callback) {
	// The path to the file is required
	if (!file.path) return callback();

	// Detect required information if it wasn't provided by inspecting the
	// file stored at file.path
	if (this.schema.filetype) {
		if (!file.mimetype) file.mimetype = mime(file.path);
	}
	if (this.schema.filesize) {
		if (!file.size) {
			try {
				// TODO: Improve this by removing the sync call; requires this whole
				// code block to be more complex & call adapter.upload after the
				// callback so I've gone with the simple statSync option for now
				var stats = fs.statSync(file.path);
				if (!stats.isFile()) {
					return callback(new Error(file.path + ' is not a file'));
				}
				file.size = stats.size;
			} catch (e) {
				return callback(e);
			}
		}
	}
	if (!file.originalname) {
		file.originalname = file.name || file.path.substr(file.path.lastIndexOf(path.sep) + 1);
	}

	// Use the adapter to upload the file
	var adapter = this.adapter;
	adapter.uploadFile(file, function (err, result) {
		if (err) return callback(err);
		result.url = adapter.getFileURL(result);
		callback(null, result);
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

module.exports = Storage;
