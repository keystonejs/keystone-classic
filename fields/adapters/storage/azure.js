var keystone = require('../../../');

var StorageAdapter = require('../StorageAdapter'),
	util = require('util'),
	path = require('path'),
	_ = require('underscore'),
	azure = require('azure');

function azurefile() {
	StorageAdapter.apply(this, arguments);

	if (!this.azurefileconfig) {
		throw new Error('Invalid Configuration\n\n' +
		'S3s stores require the "s3 config" option to be set.\n\n' +
		'See http://keystonejs.com/docs/configuration/#services-amazons3 for more information.\n');

	}

}

util.inherits(azurefile, StorageAdapter);

/**
 * Exposes the custom or keystone s3 config settings
 */

Object.defineProperty(azurefile.prototype, 'azurefileconfig', {
	get: function() {
		return this.options.azurefileconfig || keystone.get('azurefile config');
	}
});

azurefile.prototype.getPaths = function(basePaths) {
	return _.defaults({
		url      : String,
		etag     : String,
		container: String
	}, basePaths);
};

azurefile.prototype.uploadFile = function(field, item, file, callback) {
	var self = this,
		options = _.defaults({}, field.options, this.options),
		filename = this.normaliseFilename(item, file, options),
		filetype = file.mimetype || file.type,
		azurefileconfig = _.default({}, field.azurefileconfig, this.azurefileconfig),
		blobService = azure.createBlobService(),
		container = field.options.containerFormatter(item, filename);

	blobService.createContainerIfNotExists(container, {publicAccessLevel: 'blob'}, function(err) {

		if (err) return callback(err);

		blobService.createBlockBlobFromLocalFile(container, filename, file.path, function(err, blob, res) {

			if (err) return callback(err);

			var fileData = {
				filename    : blob.blob,
				originalname: file.originalname,
				size        : file.size,
				filetype    : filetype,
				etag        : blob.etag,
				container   : container,
				url         : 'http://' + azurefileconfig.account + '.blob.core.windows.net/' + container + '/' + blob.blob
			};

			callback(null, fileData);

		});
	});
};

azurefile.prototype.fileExists = function(item, paths) {
	return (item.get(paths.url) ? true : false);
};

azurefile.prototype.deleteFile = function(field, file, callback) {
	try {
		azure.createBlobService().blobService.deleteBlob(this.get(paths.container), this.get(paths.filename), function() {
		});
	} catch (e) {
	}
};
