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

localfile.prototype.uploadFile = function(field, item, data, callback) {
	var self = this,
		options = _.defaults({}, field.options, this.options),
		filename = this.normaliseFilename(item, data, options),
		src = data.path,
		dest = path.join(options.dest, filename);

	fsExtra.move(src, dest, {
		clobber: options.overwrite
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
	fsExtra.unlink(data.path, callback);
};

localfile.prototype.fileExists = function(item, data){
	console.log(item, data);
	var filepath = item.get(data.path);
	
	if (!filepath ) {
		return false;
	}
	
	return fs.existsSync(filepath);
};

module.exports = localfile;
