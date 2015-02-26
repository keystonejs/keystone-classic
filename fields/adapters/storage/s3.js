var _ = require('underscore'),
	moment = require('moment'),
	keystone = require('../../../'),
	async = require('async'),
	util = require('util'),
	path = require('path'),
	knox = require('knox'),
	utils = require('keystone-utils');

function s3file(options) {
	_.extend(options, keystone.get('s3 config'));
	this.options = options;
	this.client = knox.createClient(this.options);
}

s3file.prototype.uploadFile = function(file, callback) {
	var self = this;

	this.client.putFile(file.path, path + filename, {
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
	//this.client(this.get(paths.path) + this.get(paths.filename), function(err, res){ return res ? res.resume() : false; });
};

module.exports = s3file;
