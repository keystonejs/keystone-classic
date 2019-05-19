var fs = require('fs');
var multer = require('multer');
var os = require('os');

function handleUploadedFiles (req, res, next) {
	if (!req.files || !Array.isArray(req.files)) return next();
	var originalFiles = req.files;
	var files = {};
	originalFiles.forEach(function (i) {
		if (i.fieldname in files) {
			var tmp = files[i.fieldname];
			files[i.fieldname] = [tmp];
		}
		if (Array.isArray(files[i.fieldname])) {
			files[i.fieldname].push(i);
		} else {
			files[i.fieldname] = i;
		}
	});
	req.files = files;
	var cleanup = function () {
		originalFiles.forEach(function (i) {
			if (i.path) {
				fs.unlink(i.path, function () {});
			}
		});
	};
	res.on('close', cleanup);
	res.on('finish', cleanup);
	next();
};

exports.handleUploadedFiles = handleUploadedFiles;

exports.configure = function (app, options) {
	var storage = multer.diskStorage({
		destination: os.tmpdir(),
		filename: function (req, file, cb) {
			cb(null, file.originalname);
		},
	});
	var upload = multer(options || {
		storage: storage,
	});
	app.use(upload.any());
	app.use(handleUploadedFiles);
};
