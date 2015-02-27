var StorageAdapter = require('./StorageAdapter'),
	pkgcloud = require('pkgcloud'),
	util = require('util'),
	fs = require('fs'),
	_ = require('underscore');

module.exports = function(provider, additionalOptions) {
	function PkgCloudAdapater() {
		StorageAdapter.apply(this, arguments);

		if (additionalOptions) {
			this.options = _.extend(additionalOptions(), this.options);
		}

		this.options.provider = provider;
		this.client = pkgcloud.storage.createClient(this.options);
	}

	util.inherits(PkgCloudAdapater, StorageAdapter);

	PkgCloudAdapater.prototype.uploadFile = function(data, callback) {
		var readStream = fs.createReadStream(data.path);

		var writeStream = this.client.upload({
			container: 'keystone',
			remote: this.normaliseFilename(data.name)
		});

		writeStream.on('error', function(err) {
			callback(err);
		});

		writeStream.on('success', function(file) {
			console.log(file);
		});

		readStream.pipe(writeStream);
	};
	
	PkgCloudAdapater.prototype.deleteFile = function(data, callback) {

	};

	return PkgCloudAdapater;
};
