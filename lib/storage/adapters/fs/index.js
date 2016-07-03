var fs = require('fs-extra');

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
