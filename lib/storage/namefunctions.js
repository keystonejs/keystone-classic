var crypto = require('crypto');

// **** Simple functions for generating stored filenames.

function filenameFromBuffer (buffer, extension) {
	// Helper to throw out weird url-unsafe characters and take the first 16
	// characters - which gives us 12 bytes of entropy.
	var filename = buffer.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '')
		.slice(0, 16);

	if (extension) filename = filename + '.' + extension;

	return filename;
}

// Calculate the filename from the sha1 hash of the file contents
exports.contentHashFilename = function (file, i, callback) {
	var hash = crypto.createHash('sha1');
	var calledCallback = false;
	fs.createReadStream(file.path)
		.on('error', function (err) {
			// I'm worried that on('error') might fire after on('readable')
			// happens.
			if (calledCallback) return;
			calledCallback = true;
			callback(err);
		})
		.pipe(hash);

	hash.on('readable', function () {
		var data = hash.read();
		if (data == null) return;

		if (calledCallback) return;
		calledCallback = true;
		// Data is a node Buffer.
		callback(null, filenameFromBuffer(data, file.extension));
	});
};

exports.originalFilename = function (file) {
	return file.originalname;
};

exports.randomFilename = function (file, i, callback) {
	crypto.randomBytes(16, (err, data) => {
		if (err) return callback(err);
		return callback(null, filenameFromBuffer(data, file.extension));
	});
};
