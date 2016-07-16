var assign = require('object-assign');
var fs = require('fs-extra');
var nameFunctions = require('../../nameFunctions');
var path = require('path');
var sanitize = require('sanitize-filename');
var url = require('url');

var debug = require('debug')('keystone:storage:adapter:fs');

var DEFAULT_OPTIONS = {
	generateFilename: nameFunctions.randomFilename,
	whenExists: 'retry',
	retryAttempts: 3, // For whenExists: 'retry'.
};

function ensurePath (path) {
	// Ensure that the specified path exists and is writable. This is quick and
	// happens on server startup, so sync functions are ok.
	try {
		// accessSync throws if the item doesn't exist or we don't have
		// permission to read + write it.
		fs.accessSync(path, fs.R_OK | fs.W_OK);

		if (!fs.statSync(path).isDirectory()) {
			throw Error('Specified output path is not a directory');
		}
	} catch (e) {
		if (e.code === 'ENOENT') {
			// Recover by creating the directory.
			fs.mkdirsSync(path);
			debug('Storage output path \'' + path + '\' created');
			return;
		}
		throw e;
	}
}

function FSAdapter (options, schema) {
	if (!schema.filename) throw Error('Cannot use FSAdapter without storing filename');

	this.options = assign({}, DEFAULT_OPTIONS, options.fs);
	debug('Initialising FS Adapter with options', this.options);

	// The generateFilename option takes an optional callback. Wrap it to always
	// take a callback.
	if (this.options.generateFilename.length <= 2) { // (file) or (file, attempt)
		// If generateFilename throws we treat that as a runtime error and not
		// a file data error. If you need to pass errors upstream take a
		// callback.
		var original = options.generateFilename;
		options.generateFilename = function (file, attempt, callback) {
			callback(null, original(file, attempt));
		};
	}

	ensurePath(this.options.path);
}

FSAdapter.compatibilityLevel = 1;

// All the extra schema fields supported by this adapter.
FSAdapter.SCHEMA_TYPES = {
	// This adapter stores its key in the name of a file on disk.
	filename: String,
};

FSAdapter.SCHEMA_FIELD_DEFAULTS = {
	filename: true,
};

/**
	Gets the public path of a stored file by combining the publicPath option
	with the filename in the field value
*/
FSAdapter.prototype.getFileURL = function (file) {
	var publicPath = this.options.publicPath;
	if (!publicPath) return null; // No URL.

	return url.resolve(publicPath, file.filename);
};

/**
	Private function for getting the on-disk filename
*/
FSAdapter.prototype._pathForFile = function (filename) {
	return path.resolve(this.options.path, sanitize(filename));
};

/**
	Generates a filename with the provided method in a retry loop, used by
	_getFilename below
*/
FSAdapter.prototype._retryFilename = function (attempt, file, callback) {
	var adapter = this;
	if (attempt > this.options.retryAttempts) {
		return callback(Error('Unique filename could not be generated; Maximum attempts exceeded'));
	}
	this.options.generateFilename(file, attempt, function (err, filename) {
		if (err) return callback(err);
		adapter.fileExists(filename, function (err, exists) {
			if (err) return callback(err);
			if (exists) return adapter._retryFilename(attempt + 1, file, callback);
			callback(null, filename);
		});
	});
};

/**
	Gets a filename for uploaded files based on the adapter options
*/
FSAdapter.prototype._getFilename = function (file, callback) {
	var adapter = this;
	switch (this.options.whenExists) {
		case 'overwrite':
			this.options.generateFilename(file, 0, callback);
			break;
		case 'error':
			this.options.generateFilename(file, 0, function (err, filename) {
				if (err) return callback(err);
				adapter.fileExists(filename, function (err, result) {
					if (err) return callback(err);
					if (result === true) return callback(Error('File already exists'));
					callback(null, filename);
				});
			});
			break;
		case 'retry':
			this._retryFilename(0, file, callback);
			break;
	}
};

/**
	Uploads a file at the specified path and returns the value to be stored
	in the field value. The file argument must be an object as per the [multer
	file information spec](https://github.com/expressjs/multer#file-information)
*/
FSAdapter.prototype.uploadFile = function (file, callback) {
	debug('Uploading file', file);
	var self = this;
	this._getFilename(file, function (err, filename) {
		if (err) return callback(err);
		filename = sanitize(filename);
		debug('Uploading file with filename: %s', filename);
		var uploadPath = path.resolve(this.options.path, filename);
		fs.move(file.path, uploadPath, function (err) {
			if (err) return callback(err);

			// TODO: Chmod the file.

			var data = {
				filename: filename,
				size: file.size,
				mimetype: file.mimetype,
				path: self.options.path,
				originalname: file.originalname,
			};
			debug('Uploaded file, returning data', data);
			callback(null, data);
		});
	});
};

FSAdapter.prototype.removeFile = function (file, callback) {
	debug('Removing file', file);
	fs.unlink(this._pathForFile(file.filename), function (err) {
		if (err && err.code === 'ENOENT') {
			// The file doesn't exist.
			console.warn('Attempted to remove a non-existant file');
			return callback();
		}

		callback(err);
	});
};

FSAdapter.prototype.fileExists = function (filename, callback) {
	var path = this._pathForFile(filename);
	debug('Checking for file at path %s', filename);
	// Returns (err, bool) to the callback based on whether or not the file
	// already exists. Used if whenExists: 'error' or 'retry' in the options
	fs.stat(path, function (err, stats) {
		if (err && err.code === 'ENOENT') {
			// File does not exist
			callback(null, false);
		} else if (err) {
			// Other error getting file info
			callback(err);
		} else if (stats.isFile()) {
			// File does exist
			callback(null, true);
		} else {
			// Object at path is not a file
			callback(Error('Invalid save destination - dest is not a file'));
		}
	});
};

module.exports = FSAdapter;
