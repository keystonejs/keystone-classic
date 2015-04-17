var StorageAdapter = require('../StorageAdapter'),
	util = require('util'),
	path = require('path'),
	_ = require('underscore'),
	fs = require('fs'),
	fsExtra = require('fs-extra');

function localfile() {
	StorageAdapter.apply(this, arguments);

	if (!this.options.dest) {
		throw new Error('Invalid Configuration\n\nlocalfile store requires the "dest" option to be set.');
	}
	
}

util.inherits(localfile, StorageAdapter);

localfile.prototype.getPaths = function(basePaths) {
	return _.defaults({
		path      : String
	}, basePaths);
};

localfile.prototype.uploadFile = function(field, item, file, callback) {
	var self = this,
		options = _.defaults({}, field.options, this.options),
		filename = this.normaliseFilename(item, file, options),
		src = file.path,
		dest = path.join(options.dest, filename);

	fsExtra.move(src, dest, {
		clobber: options.overwrite
	}, function(err) {
		if (err) return callback(err);

		callback(null, {
			filename: filename,
			originalname: file.originalname,
			path: dest,
			size: file.size,
			filetype: file.mimetype || file.type
		});
	});
};

localfile.prototype.deleteFile = function (field, file, callback) {
	fs.unlink(path.resolve(file.path), callback);
};

localfile.prototype.fileExists = function(item, data) {
	var filepath = item.get(data.path);
	
	if (!filepath ) {
		return false;
	}
	return fs.existsSync(path.resolve(filepath));
};

module.exports = localfile;
