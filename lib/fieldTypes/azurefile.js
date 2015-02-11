/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	moment = require('moment'),
	keystone = require('../../'),
	async = require('async'),
	util = require('util'),
	azure = require('azure'),
	utils = require('keystone-utils'),
	super_ = require('../field');


/**
 * AzureFile FieldType Constructor
 * @extends Field
 * @api public
 */

function azurefile(list, path, options) {

	this._underscoreMethods = ['format', 'uploadFile'];

	// event queues
	this._pre = {
		upload: []
	};

	// TODO: implement filtering, usage disabled for now
	options.nofilter = true;

	// TODO: implement initial form, usage disabled for now
	if (options.initial) {
		throw new Error('Invalid Configuration\n\nAzureFile fields (' + list.key + '.' + path + ') do not currently support being used as initial fields.\n');
	}

	azurefile.super_.call(this, list, path, options);

	// validate azurefile config (has to happen after super_.call)
	if (!this.azurefileconfig) {
		throw new Error('Invalid Configuration\n\n' +
			'AzureFile fields (' + list.key + '.' + path + ') require the "azurefile config" option to be set.\n\n' +
			'See http://keystonejs.com/docs/configuration/#services-azure for more information.\n');
	}

	process.env.AZURE_STORAGE_ACCOUNT = this.azurefileconfig.account;
	process.env.AZURE_STORAGE_ACCESS_KEY = this.azurefileconfig.key;

	this.azurefileconfig.container = this.azurefileconfig.container || 'keystone';

	var self = this;
	options.filenameFormatter = options.filenameFormatter || function(item, filename) { return filename; };
	options.containerFormatter = options.containerFormatter || function(item, filename) { return self.azurefileconfig.container; };

	// Could be more pre- hooks, just upload for now
	if (options.pre && options.pre.upload) {
		this._pre.upload = this._pre.upload.concat(options.pre.upload);
	}

}

/*!
 * Inherit from Field
 */

util.inherits(azurefile, super_);

/**
 * Exposes the custom or keystone s3 config settings
 */

Object.defineProperty(azurefile.prototype, 'azurefileconfig', { get: function() {
	return this.options.azurefileconfig || keystone.get('azurefile config');
}});


/**
 * Allows you to add pre middleware after the field has been initialised
 *
 * @api public
 */

azurefile.prototype.pre = function(event, fn) {
	if (!this._pre[event]) {
		throw new Error('AzureFile (' + this.list.key + '.' + this.path + ') error: azurefile.pre()\n\n' +
			'Event ' + event + ' is not supported.\n');
	}
	this._pre[event].push(fn);
	return this;
};


/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */

azurefile.prototype.addToSchema = function() {

	var field = this,
		schema = this.list.schema;

	var paths = this.paths = {
		// fields
		filename:		this._path.append('.filename'),
		path:			this._path.append('.path'),
		size:			this._path.append('.size'),
		filetype:		this._path.append('.filetype'),
		url:			this._path.append('.url'),
		etag:			this._path.append('.etag'),
		container:		this._path.append('.container'),
		// virtuals
		exists:			this._path.append('.exists'),
		upload:			this._path.append('_upload'),
		action:			this._path.append('_action')
	};

	var schemaPaths = this._path.addTo({}, {
		filename:		String,
		path:			String,
		size:			Number,
		filetype:		String,
		url:			String,
		etag: 			String,
		container:		String
	});

	schema.add(schemaPaths);

	var exists = function(item) {
		return (item.get(paths.url) ? true : false);
	};

	// The .exists virtual indicates whether a file is stored
	schema.virtual(paths.exists).get(function() {
		return schemaMethods.exists.apply(this);
	});

	var reset = function(item) {
		item.set(field.path, {
			filename: '',
			path: '',
			size: 0,
			filetype: '',
			url: ''
		});
	};

	var schemaMethods = {
		exists: function() {
			return exists(this);
		},
		/**
		 * Resets the value of the field
		 *
		 * @api public
		 */
		reset: function() {
			try {
				azure.createBlobService().deleteBlob(this.get(paths.container), this.get(paths.filename), function() {});
			} catch(e) {}
			reset(this);
		},
		/**
		 * Deletes the file from AzureFile and resets the field
		 *
		 * @api public
		 */
		delete: function() {
			try {
				azure.createBlobService().blobService.deleteBlob(this.get(paths.container), this.get(paths.filename), function() {});
			} catch(e) {}
			reset(this);
		}
	};

	_.each(schemaMethods, function(fn, key) {
		field.underscoreMethod(key, fn);
	});

	// expose a method on the field to call schema methods
	this.apply = function(item, method) {
		return schemaMethods[method].apply(item, Array.prototype.slice.call(arguments, 2));
	};

	this.bindUnderscoreMethods();
};


/**
 * Formats the field value
 *
 * @api public
 */

azurefile.prototype.format = function(item) {
	return item.get(this.paths.url);
};


/**
 * Detects whether the field has been modified
 *
 * @api public
 */

azurefile.prototype.isModified = function(item) {
	return item.isModified(this.paths.url);
};


/**
 * Validates that a value for this field has been provided in a data object
 *
 * @api public
 */

azurefile.prototype.validateInput = function(data) {
	// TODO - how should file field input be validated?
	return true;
};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

azurefile.prototype.updateItem = function(item, data) {
	// TODO - direct updating of data (not via upload)
};


/**
 * Uploads the file for this field
 *
 * @api public
 */

azurefile.prototype.uploadFile = function(item, file, update, callback) {

	var field = this,
		prefix = field.options.datePrefix ? moment().format(field.options.datePrefix) + '-' : '',
		filetype = file.mimetype || file.type;

	if (field.options.allowedTypes && !_.contains(field.options.allowedTypes, filetype)) {
		return callback(new Error('Unsupported File Type: ' + filetype));
	}

	if ('function' === typeof update) {
		callback = update;
		update = false;
	}

	var doUpload = function() {
		var blobService = azure.createBlobService();
		var container = field.options.containerFormatter(item, file.name);

		blobService.createContainerIfNotExists(container, {publicAccessLevel : 'blob'}, function(err) {
			
			if (err) return callback(err);

			blobService.createBlockBlobFromLocalFile(container, field.options.filenameFormatter(item, file.name), file.path, function(err, blob, res) {

				if (err) return callback(err);
			
				var fileData = {
					filename: blob.blob,
					size: file.size,
					filetype: filetype,
					etag: blob.etag,
					container: container,
					url: 'http://' + field.azurefileconfig.account + '.blob.core.windows.net/' + container + '/' + blob.blob
				};

				if (update) {
					item.set(field.path, fileData);
				}

				callback(null, fileData);
					
			});
		});
	};

	async.eachSeries(this._pre.upload, function(fn, next) {
		fn(item, file, next);
	}, function(err) {
		if (err) return callback(err);
		doUpload();
	});
};


/**
 * Returns a callback that handles a standard form submission for the field
 *
 * Expected form parts are
 * - `field.paths.action` in `req.body` (`clear` or `delete`)
 * - `field.paths.upload` in `req.files` (uploads the file to s3file)
 *
 * @api public
 */

azurefile.prototype.getRequestHandler = function(item, req, paths, callback) {

	var field = this;

	if (utils.isFunction(paths)) {
		callback = paths;
		paths = field.paths;
	} else if (!paths) {
		paths = field.paths;
	}

	callback = callback || function() {};

	return function() {
		if (req.body) {
			var action = req.body[paths.action];

			if (/^(delete|reset)$/.test(action))
				field.apply(item, action);
		}

		if (req.files && req.files[paths.upload] && req.files[paths.upload].size) {
			return field.uploadFile(item, req.files[paths.upload], true, callback);
		}

		return callback();

	};

};


/**
 * Immediately handles a standard form submission for the field (see `getRequestHandler()`)
 *
 * @api public
 */

azurefile.prototype.handleRequest = function(item, req, paths, callback) {
	this.getRequestHandler(item, req, paths, callback)();
};


/*!
 * Export class
 */

exports = module.exports = azurefile;
