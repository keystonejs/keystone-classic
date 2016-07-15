var fs = require('fs');
var path = require('path');
var url = require('url');
var sanitize = require('sanitize-filename');


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
			console.log('Storage output path \'' + path + '\' created');
			return;
		}
		throw e;
	}
}

function FSAdapter (options, schema) {
	if (!schema.filename) throw Error('Cannot use FSAdapter without storing filename');

	this.options = options.fs || {};
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


// Private function for getting the on-disk filename
FSAdapter.prototype._pathForFile = function (filename) {
	return path.resolve(this.options.path, sanitize(filename));
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
	Uploads a file at the specified path and returns the value to be stored
	in the field value. The file argument must be an object as per the [multer
	file information spec](https://github.com/expressjs/multer#file-information)
*/
FSAdapter.prototype.uploadFile = function (destname, file, callback) {
	destname = sanitize(destname);
	var self = this;
	fs.move(file.path, this._pathForFile(destname), function (err) {
		if (err) return callback(err);

		// TODO: Chmod the file.
		callback(null, {
			filename: destname,
			size: file.size,
			mimetype: file.mimetype,
			path: self.options.path,
			originalname: file.originalname,
		});
	});
};

FSAdapter.prototype.removeFile = function (file, callback) {
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
	// Returns (err, bool) to the callback based on whether or not the file
	// already exists. Used if whenExists: 'error' or 'retry' in the storage
	// configuration.
	fs.stat(this._pathForFile(filename), function (err, stats) {
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
