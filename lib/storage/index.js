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
	the paths in the default schema.
*/
var DEFAULT_SCHEMA = {
	filename: String,
	filesize: Number,
	filetype: String,
	url: String,
};

/**
	# Storage Prototype

	Creates a new Keystone Storage instance, and validates and initialises the
	specified adapter. Storage schema is configured from the adapter or default.
*/
function Storage (options) {
	this.options = options;
	if (options.adapter.compatibilityLevel !== ADAPTER_COMPATIBILITY_LEVEL) {
		throw new Error('Incompatible Storage Adapter\n\n'
			+ 'The storage adapter specified (' + options.adapter.name + ') '
			+ 'does not match the compatibility level required for this '
			+ 'version of Keystone.');
	}
	this.adapter = new options.adapter(options);
	this.schema = this.adapter.schema || DEFAULT_SCHEMA;
}

/**
	Uploads a new file via the adapter, then decorates the result with the
	public url for the file. The result is what is saved back to the field.
*/
Storage.prototype.uploadFile = function (file, callback) {
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
