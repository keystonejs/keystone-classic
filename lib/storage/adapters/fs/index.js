var fs = require('fs-extra');
var path = require('path');
var Promise = require('es6-promise').Promise;

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

function FSAdapter (options) {
	console.log('FSAdapter', options);
	ensurePath(options.path);
	this.options = options;
}

FSAdapter.compatibilityLevel = 1;

/**
	Gets the public path of a stored file by combining the publicPath option
	with the filename in the field value
*/
FSAdapter.prototype.getFileURL = function (value) {
	if (!this.options.publicPath || !value || !value.filename) return '';
	return this.options.publicPath + value.filename;
};

/**
	Uploads a file at the specified path and returns the value to be stored
	in the field value. The file argument must be an object as per the [multer
	file information spec](https://github.com/expressjs/multer#file-information)
*/
FSAdapter.prototype.uploadFile = function (file, callback) {
	console.log('FS Adapter Uploading File:', file);

	// TODO: How should we generate the filename?
	var destpath = this.options.path;
	var destname = file.name; // This is the multer random name.

	fs.move(file.path, path.join(destpath, destname), function (err) {
		if (err) return callback(err);

		callback(null, {
			filename: destname,
			size: file.size,
			mimetype: file.mimetype,
			path: destpath,
			originalname: file.originalname,
		});
	});
};

FSAdapter.prototype.removeFile = function (value, callback) {
	console.log('FS Adapter Removing File:', value);
	// TODO: Remove the file specified at value.filename in the destination path
	callback(null);
};

module.exports = FSAdapter;
