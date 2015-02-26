var moment = require('moment'),
	path = require('path'),
	fs = require('fs-extra');

function localfile(options) {
	this.options = options;

	if (!options.dest) {
		throw new Error('Invalid Configuration\n\nlocalfile store requires the "dest" option to be set.');
	}
}

localfile.prototype.normaliseFilename = function (filename) {
	var prefix = this.options.datePrefix ? moment().format(this.options.datePrefix) + '-' : '';
	return prefix + filename;
};

localfile.prototype.uploadFile = function(data, callback) {
	var self = this,
		filename = this.normaliseFilename(data.name);

	fs.move(data.path, path.join(this.options.dest, filename), {
		clobber: this.options.overwrite
	}, function(err) {
		if (err) return callback(err);

		callback(null, {
			filename: filename,
			path: self.options.dest,
			size: data.size,
			filetype: data.mimetype || data.type
		});
	});
};

localfile.prototype.deleteFile = function (data) {
	fs.unlinkSync(data.filename);
};

module.exports = localfile;
