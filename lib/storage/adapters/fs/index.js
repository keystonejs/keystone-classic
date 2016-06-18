var fs = require('fs-extra');
var path = require('path');
var mime = require('mime-types');

function FSAdapter (options) {
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
	// The path to the file is required
	if (!file.path) return callback();
	// Detect required information if it wasn't provided by inspecting the
	// file stored at file.path
	if (!file.mimetype) file.mimetype = mime(file.path);
	if (!file.size) {
		try {
			var stats = fs.statSync(file.path);
			if (!stats.isFile()) {
				return callback(new Error(file.path + ' is not a file'));
			}
			file.size = stats.size;
		} catch (e) {
			return callback(e);
		}
	}
	if (!file.originalname) {
		file.originalname = file.name || file.path.substr(file.path.lastIndexOf(path.sep) + 1);
	}
	console.log('FS Adapter Uploading File:', file);
	// TODO: Move the file into the destination path and name it correctly
	callback(null, {
		filename: file.originalname,
		filesize: file.size,
		filetype: file.mimetype,
	});
};

FSAdapter.prototype.removeFile = function (value, callback) {
	console.log('FS Adapter Removing File:', value);
	// TODO: Remove the file specified at value.filename in the destination path
	callback(null);
};

module.exports = FSAdapter;
