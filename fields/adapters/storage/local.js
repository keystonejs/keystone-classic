var StorageAdapter = require('../StorageAdapter'),
	util = require('util'),
	path = require('path'),
	fs = require('fs-extra');

function localfile() {
	StorageAdapter.apply(this, arguments);

	if (!this.options.dest) {
		throw new Error('Invalid Configuration\n\nlocalfile store requires the "dest" option to be set.');
	}
}

util.inherits(localfile, StorageAdapter);

localfile.prototype.uploadFile = function(data, callback) {
	var self = this,
		filename = this.normaliseFilename(data.name),
		src = data.path,
		dest = path.join(this.options.dest, filename);

	fs.move(src, dest, {
		clobber: this.options.overwrite
	}, function(err) {
		if (err) return callback(err);

		callback(null, {
			filename: filename,
			originalname: data.originalname,
			path: dest,
			size: data.size,
			filetype: data.mimetype || data.type
		});
	});
};

localfile.prototype.deleteFile = function (data, callback) {
	fs.unlink(data.filename);
};

module.exports = localfile;
