var _ = require('underscore'),
	moment = require('moment'),
	keystone = require('../../../'),
	async = require('async'),
	util = require('util'),
	knox = require('knox'),
	utils = require('keystone-utils'),
	super_ = require('../Type');

function s3file(options) {
	this.options = {};
}

s3file.prototype.uploadFile = function(file, callback) {
	var self = this;

	knox.createClient(this.options).putFile(file.path, path + filename, {
		'Content-Type': filetype,
		'x-amz-acl': 'public-read'
	}, function(err, res) {

		if (res) res.resume();
		if (err) return callback(err);

		var protocol = (self.options.protocol && self.options.protocol + ':') || '',
			url = res.req.url.replace(/^https?:/i, protocol);

		callback(null, {
			filename: filename,
			path: path,
			size: file.size,
			filetype: filetype,
			url: url
		});

	});
};

s3file.prototype.deleteFile = function () {
	var client = knox.createClient(field.s3config);
	client.deleteFile(this.get(paths.path) + this.get(paths.filename), function(err, res){ return res ? res.resume() : false; });
};
