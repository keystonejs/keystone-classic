/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	keystone = require('../../../'),
	util = require('util'),
	uploadcare = require('uploadcare'),
	uccdn = require('uploadcare-cdn'),
	MPromise = require('mpromise'),
	utils = require('keystone-utils'),
	super_ = require('../Type'),
	fs = require('fs');

/**
 * UploadcareImage FieldType Constructor
 * @extends Field
 * @api public
 */

function uploadcareimage(list, path, options) {

	this._underscoreMethods = ['format'];
	this._fixedSize = 'full';

	// TODO: implement filtering, usage disabled for now
	options.nofilter = true;

	// TODO: implement initial form, usage disabled for now
	if (options.initial) {
		throw new Error(
			'Invalid Configuration\n\n' +
			'UploadcareImage fields (' + list.key + '.' + path + ') do not currently support being used as initial fields.\n'
		);
	}

	uploadcareimage.super_.call(this, list, path, options);

	// validate uploadcare config
	if (!keystone.get('uploadcare private key')) {
		throw new Error(
			'Invalid Configuration\n\n' +
			'UploadcareImage fields (' + list.key + '.' + this.path + ') require the "uploadcare private key" option to be set.\n\n' +
			'See http://keystonejs.com/docs/configuration/#services-uploadcare for more information.\n'
		);
	}

	if (!keystone.get('uploadcare public key')) {
		throw new Error(
			'Invalid Configuration\n\n' +
			'UploadcareImage fields (' + list.key + '.' + this.path + ') require the "uploadcare public key" option to be set.\n\n' +
			'See http://keystonejs.com/docs/configuration/#services-uploadcare for more information.\n'
		);
	}
}

/*!
 * Inherit from Field
 */

util.inherits(uploadcareimage, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */

uploadcareimage.prototype.addToSchema = function() {

	var field = this,
		schema = this.list.schema,
		uc = uploadcare(keystone.get('uploadcare public key'), keystone.get('uploadcare private key'));

	var paths = this.paths = {
		// uploadcare fields
		datetime_stored: 	this._path.append('.datetime_stored'),
		datetime_uploaded: 	this._path.append('.datetime_uploaded'),
		is_image: 			this._path.append('.is_image'),
		mime_type: 			this._path.append('.mime_type'),
		original_file_url: 	this._path.append('.original_file_url'),
		original_filename: 	this._path.append('.original_filename'),
		size: 				this._path.append('.size'),
		url: 				this._path.append('.url'),
		uuid: 				this._path.append('.uuid'),
		image_info: 		this._path.append('.image_info'),
		// form paths
		upload: 			this._path.append('_upload'),
		action: 			this._path.append('_action'),
		select: 			this._path.append('_select')
	};

	var schemaPaths = this._path.addTo({}, {
		datetime_stored: 		String,
		datetime_uploaded: 		String,
		is_image: 				Boolean,
		mime_type: 				String,
		original_file_url: 		String,
		original_filename: 		String,
		size: 					Number,
		url: 					String,
		uuid: 					String,
		image_info: {
			height: 			Number,
			width: 				Number,
			geo_location:		String,
			datetime_original: 	String,
			format: 			String
		}
	});

	schema.add(schemaPaths);

	var reset = function(item) {
		item.set(field.path, {
			datetime_stored: 		'',
			datetime_uploaded: 		'',
			is_image: 				false,
			mime_type: 				'',
			original_file_url: 		'',
			original_filename: 		'',
			size: 					0,
			url: 					'',
			uuid: 					'',
			image_info: {
				height: 			0,
				width: 				0,
				geo_location:		'',
				datetime_original: 	'',
				format: 			''
			}
		});
	};

	// Use the uploadcare-cdn methods, automatically passing the url as the 1st param
	var schemaMethods = Object.keys(uccdn).reduce(function (schemaMethods, key) {
		schemaMethods[key] = function () {
			var args = [].slice.call(arguments);
			return uccdn[key].apply(null, [this.get(paths.original_file_url)].concat(args));
		};
		return schemaMethods;
	}, {});

	schemaMethods.reset = function () {
		reset(this);
	};

	schemaMethods.delete = function() {
		var promise = new MPromise();
		uc.files.remove(this.get(paths.uuid), function(err, result) {
			promise.resolve(err, result);
		});
		reset(this);
		return promise;
	};

	schemaMethods.upload = function(file) {
		var promise = new MPromise();
		uc.file.upload(fs.createReadStream(file), function(err, result) {
			if (err) {
				promise.reject(err);
			} else {
				uc.files.store(result.file, function(err, result) {
					promise.resolve(err, result);
				});
			}
		});
		return promise;
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

uploadcareimage.prototype.format = function(item) {
	return item.get(this.paths.url);
};


/**
 * Detects whether the field has been modified
 *
 * @api public
 */

uploadcareimage.prototype.isModified = function(item) {
	return item.isModified(this.paths.url);
};


/**
 * Validates that a value for this field has been provided in a data object
 *
 * @api public
 */

uploadcareimage.prototype.validateInput = function(data) {//eslint-disable-line no-unused-vars
	// TODO - how should image field input be validated?
	return true;
};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

uploadcareimage.prototype.updateItem = function(item, data) {
	var paths = this.paths;

	var setValue = function(key) {
		if (paths[key]) {
			var index = paths[key].indexOf('.');
			var field = paths[key].substr(0, index);
			// Note we allow implicit conversion here so that numbers submitted as strings in the data object
			// aren't treated as different values to the stored Number values
			if (data[field] && data[field][key] && data[field][key] != item.get(paths[key])) { // eslint-disable-line eqeqeq
				item.set(paths[key], data[field][key] || null);
			}
		}
	};

	_.each(['datetime_stored', 'datetime_uploaded', 'is_image', 'mime_type', 'original_file_url', 'original_filename', 'size', 'url', 'uuid', 'image_info'], setValue);
};


/**
 * Returns a callback that handles a standard form submission for the field
 *
 * Expected form parts are
 * - `field.paths.action` in `req.body` (`clear` or `delete`)
 * - `field.paths.upload` in `req.files` (uploads the image to cloudinary)
 *
 * @api public
 */

uploadcareimage.prototype.getRequestHandler = function(item, req, paths, callback) {

	var field = this,
		uc = uploadcare(keystone.get('uploadcare public key'), keystone.get('uploadcare private key'));

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

			if (/^(delete|reset)$/.test(action)) {
				field.apply(item, action);
			}
		}

		if (req.body && req.body[paths.select]) {

			uc.files.info(req.body[paths.select], function(err, info) {
				if (err) {
					return callback(err);
				}

				item.set(field.path, info);
				callback();
			});

		} else if (req.files && req.files[paths.upload] && req.files[paths.upload].size) {
			var imageDelete;

			if (field.options.autoCleanup && item.get(field.paths.url)) {
				// capture image delete promise
				imageDelete = field.apply(item, 'delete');
			}

			// callback to be called upon completion of the 'upload' method
			var uploadComplete = function(err, result) {
				if (err) {
					callback(err);
				} else {
					item.set(field.path, result);
					callback();
				}
			};

			// upload immediately if image is not being delete
			if (!imageDelete) {
				field.apply(item, 'upload', req.files[paths.upload].path).onResolve(uploadComplete);
			} else {
				// otherwise wait until image is deleted before uploading
				// this avoids problems when deleting/uploading images with the same public_id (issue #598)
				imageDelete.onResolve(function(err) {
					if (err) {
						callback(err);
					} else {
						field.apply(item, 'upload', req.files[paths.upload].path).onResolve(uploadComplete);
					}
				});
			}

		} else {
			callback();
		}

	};

};


/**
 * Immediately handles a standard form submission for the field (see `getRequestHandler()`)
 *
 * @api public
 */

uploadcareimage.prototype.handleRequest = function(item, req, paths, callback) {
	this.getRequestHandler(item, req, paths, callback)();
};


/*!
 * Export class
 */

exports = module.exports = uploadcareimage;
