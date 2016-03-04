var _ = require('lodash');
var assign = require('object-assign');
var cloudinary = require('cloudinary');
var keystone = require('../../../');
var super_ = require('../Type');
var util = require('util');
var utils = require('keystone-utils');

var CLOUDINARY_FIELDS = ['public_id', 'version', 'signature', 'format', 'resource_type', 'url', 'width', 'height', 'secure_url'];

function getEmptyValue () {
	return {
		public_id: '',
		version: 0,
		signature: '',
		format: '',
		resource_type: '',
		url: '',
		width: 0,
		height: 0,
		secure_url: '',
	};
}

/**
 * CloudinaryImage FieldType Constructor
 * @extends Field
 * @api public
 */
function cloudinaryimage (list, path, options) {

	this._underscoreMethods = ['format'];
	this._fixedSize = 'full';
	this._properties = ['select', 'selectPrefix', 'autoCleanup', 'publicID', 'folder', 'filenameAsPublicID'];

	// TODO: implement filtering, usage disabled for now
	options.nofilter = true;

	cloudinaryimage.super_.call(this, list, path, options);

	// validate cloudinary config
	if (!keystone.get('cloudinary config')) {
		throw new Error(
			'Invalid Configuration\n\n'
			+ 'CloudinaryImage fields (' + list.key + '.' + this.path + ') require the "cloudinary config" option to be set.\n\n'
			+ 'See http://keystonejs.com/docs/configuration/#services-cloudinary for more information.\n'
		);
	}

}

/*!
 * Inherit from Field
 */

util.inherits(cloudinaryimage, super_);

/**
 * Gets the folder for images in this field
 */
cloudinaryimage.prototype.getFolder = function () {
	var folder = null;

	if (keystone.get('cloudinary folders') || this.options.folder) {
		if (typeof this.options.folder === 'string') {
			folder = this.options.folder;
		} else {
			var folderList = keystone.get('cloudinary prefix') ? [keystone.get('cloudinary prefix')] : [];
			folderList.push(this.list.path);
			folderList.push(this.path);
			folder = folderList.join('/');
		}
	}

	return folder;
};

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */
cloudinaryimage.prototype.addToSchema = function () {

	var field = this;
	var schema = this.list.schema;

	var paths = this.paths = {
		// cloudinary fields
		public_id: this._path.append('.public_id'),
		version: this._path.append('.version'),
		signature: this._path.append('.signature'),
		format: this._path.append('.format'),
		resource_type: this._path.append('.resource_type'),
		url: this._path.append('.url'),
		width: this._path.append('.width'),
		height: this._path.append('.height'),
		secure_url: this._path.append('.secure_url'),
		// virtuals
		exists: this._path.append('.exists'),
		folder: this._path.append('.folder'),
		// form paths
		upload: this._path.append('_upload'),
		action: this._path.append('_action'),
		select: this._path.append('_select'),
	};

	var schemaPaths = this._path.addTo({}, {
		public_id: String,
		version: Number,
		signature: String,
		format: String,
		resource_type: String,
		url: String,
		width: Number,
		height: Number,
		secure_url: String,
	});

	schema.add(schemaPaths);

	var exists = function (item) {
		return (item.get(paths.public_id) ? true : false);
	};

	// The .exists virtual indicates whether an image is stored
	schema.virtual(paths.exists).get(function () {
		return schemaMethods.exists.apply(this);
	});

	// The .folder virtual returns the cloudinary folder used to upload/select images
	schema.virtual(paths.folder).get(function () {
		return schemaMethods.folder.apply(this);
	});

	var src = function (item, options) {

		if (!exists(item)) {
			return '';
		}

		options = (typeof options === 'object') ? options : {};

		if (!('fetch_format' in options) && keystone.get('cloudinary webp') !== false) {
			options.fetch_format = 'auto';
		}

		if (!('progressive' in options) && keystone.get('cloudinary progressive') !== false) {
			options.progressive = true;
		}

		if (!('secure' in options) && keystone.get('cloudinary secure')) {
			options.secure = true;
		}

		options.version = item.get(paths.version);

		return cloudinary.url(item.get(paths.public_id) + '.' + item.get(paths.format), options);

	};

	var reset = function (item) {
		item.set(field.path, getEmptyValue());
	};

	var addSize = function (options, width, height, other) {
		if (width) options.width = width;
		if (height) options.height = height;
		if (typeof other === 'object') {
			assign(options, other);
		}
		return options;
	};

	var schemaMethods = {
		exists: function () {
			return exists(this);
		},
		folder: function () {
			return field.folder();
		},
		src: function (options) {
			return src(this, options);
		},
		tag: function (options) {
			return exists(this) ? cloudinary.image(this.get(field.path).public_id, options) : '';
		},
		scale: function (width, height, options) {
			return src(this, addSize({ crop: 'scale' }, width, height, options));
		},
		fill: function (width, height, options) {
			return src(this, addSize({ crop: 'fill', gravity: 'faces' }, width, height, options));
		},
		lfill: function (width, height, options) {
			return src(this, addSize({ crop: 'lfill', gravity: 'faces' }, width, height, options));
		},
		fit: function (width, height, options) {
			return src(this, addSize({ crop: 'fit' }, width, height, options));
		},
		limit: function (width, height, options) {
			return src(this, addSize({ crop: 'limit' }, width, height, options));
		},
		pad: function (width, height, options) {
			return src(this, addSize({ crop: 'pad' }, width, height, options));
		},
		lpad: function (width, height, options) {
			return src(this, addSize({ crop: 'lpad' }, width, height, options));
		},
		crop: function (width, height, options) {
			return src(this, addSize({ crop: 'crop', gravity: 'faces' }, width, height, options));
		},
		thumbnail: function (width, height, options) {
			return src(this, addSize({ crop: 'thumb', gravity: 'faces' }, width, height, options));
		},
		/**
		 * Resets the value of the field
		 *
		 * @api public
		 */
		reset: function () {
			reset(this);
		},
		/**
		 * Deletes the image from Cloudinary and resets the field
		 *
		 * @api public
		 */
		delete: function () {
			var _this = this;
			var promise = new Promise(function (resolve, reject) {
				cloudinary.uploader.destroy(_this.get(paths.public_id), function (result) {
					resolve(result);
				});
			});
			reset(this);
			return promise;
		},
		/**
		 * Uploads the image to Cloudinary
		 *
		 * @api public
		 */
		upload: function (file, options) {
			var promise = new Promise(function (resolve, reject) {
				cloudinary.uploader.upload(file, function (result) {
					resolve(result);
				}, options);
			});
			return promise;
		},
	};

	_.forEach(schemaMethods, function (fn, key) {
		field.underscoreMethod(key, fn);
	});

	// expose a method on the field to call schema methods
	this.apply = function (item, method) {
		return schemaMethods[method].apply(item, Array.prototype.slice.call(arguments, 2));
	};

	this.bindUnderscoreMethods();
};

/**
 * Formats the field value
 *
 * @api public
 */
cloudinaryimage.prototype.format = function (item) {
	return item.get(this.paths.url);
};

/**
 * Detects whether the field has been modified
 *
 * @api public
 */
cloudinaryimage.prototype.isModified = function (item) {
	return item.isModified(this.paths.public_id);
};


function validateInput (value) {
	// undefined values are always valid
	if (value === undefined) return true;
	// TODO: strings may not actually be valid but this will be OK for now
	if (typeof value === 'string') return true;
	// If the value is an object and has a cloudinary public_id, it is valid
	if (typeof value === 'object' && value.public_id) return true;
	// If the value is an uploaded file, it is valid
	if (typeof value === 'object' && value.path) return true;
	return false;
}

/**
 * Validates that a value for this field has been provided in a data object
 */
cloudinaryimage.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	utils.defer(callback, validateInput(value));
};

/**
 * Validates that input has been provided
 */
cloudinaryimage.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	var result = ((value && validateInput(value)) || item.get(this.path).public_id) ? true : false;
	utils.defer(callback, result);
};

/**
 * Always assumes the input is valid
 *
 * Deprecated
 */
cloudinaryimage.prototype.inputIsValid = function () {
	return true;
};

/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */
cloudinaryimage.prototype.updateItem = function (item, data, callback) {
	var field = this;
	var paths = this.paths;
	var value = this.getValueFromData(data);

	// Allow field value reset
	if (value === '' || value === 'null' || (typeof value === 'object' && !Object.keys(value).length)) {
		item.set(this.path, getEmptyValue());
		return process.nextTick(callback);
	}

	// When the value is a string, assume it's base64 data or a remote URL and
	// upload it to cloudinary as a file path. More logic could be added here to
	// detect/prevent invalid uploads
	if (typeof value === 'string') {
		value = { path: value };
	}

	if (typeof value === 'object' && 'public_id' in value) {
		// Cloudinary Image data provided
		if (value.public_id) {
			var v = assign(getEmptyValue(), value);
			item.set(this.path, v);
		} else {
			item.set(this.path, getEmptyValue());
		}
		return process.nextTick(callback);
	} else if (typeof value === 'object' && value.path) {
		// File provided - upload it
		var tagPrefix = keystone.get('cloudinary prefix') || '';
		var uploadOptions = {
			tags: [],
		};
		if (tagPrefix.length) {
			uploadOptions.tags.push(tagPrefix);
			tagPrefix += '_';
		}
		uploadOptions.tags.push(tagPrefix + field.list.path + '_' + field.path);
		if (keystone.get('env') !== 'production') {
			uploadOptions.tags.push(tagPrefix + 'dev');
		}
		var folder = this.getFolder();
		if (folder) {
			uploadOptions.folder = folder;
		}
		// NOTE: field.options.publicID has been deprecated (tbc)
		if (field.options.filenameAsPublicID && value.originalname && typeof value.originalname === 'string') {
			uploadOptions.public_id = value.originalname.substring(0, value.originalname.lastIndexOf('.'));
		}
		// TODO: implement autoCleanup; should delete existing images before uploading
		cloudinary.uploader.upload(value.path, function (result) {
			if (result.error) {
				return callback(result.error);
			} else {
				item.set(field.path, result);
				return callback();
			}
		}, uploadOptions);
	} else {
		// Nothing to do
		return process.nextTick(callback);
	}
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
cloudinaryimage.prototype.getRequestHandler = function (item, req, paths, callback) {

	var field = this;

	if (utils.isFunction(paths)) {
		callback = paths;
		paths = field.paths;
	} else if (!paths) {
		paths = field.paths;
	}

	callback = callback || function () {};

	return function () {

		if (req.body) {
			var action = req.body[paths.action];

			if (/^(delete|reset)$/.test(action)) {
				field.apply(item, action);
			}
		}

		if (req.body && req.body[paths.select]) {

			cloudinary.api.resource(req.body[paths.select], function (result) {
				if (result.error) {
					callback(result.error);
				} else {
					item.set(field.path, result);
					callback();
				}
			});

		} else if (req.files && req.files[paths.upload] && req.files[paths.upload].size) {

			var tp = keystone.get('cloudinary prefix') || '';
			var imageDelete;

			if (tp.length) {
				tp += '_';
			}

			var uploadOptions = {
				tags: [tp + field.list.path + '_' + field.path, tp + field.list.path + '_' + field.path + '_' + item.id],
			};

			if (keystone.get('cloudinary folders')) {
				uploadOptions.folder = item.get(paths.folder);
			}

			if (keystone.get('cloudinary prefix')) {
				uploadOptions.tags.push(keystone.get('cloudinary prefix'));
			}

			if (keystone.get('env') !== 'production') {
				uploadOptions.tags.push(tp + 'dev');
			}

			if (field.options.publicID) {
				var publicIdValue = item.get(field.options.publicID);
				if (publicIdValue) {
					uploadOptions.public_id = publicIdValue;
				}
			} else if (field.options.filenameAsPublicID) {
				uploadOptions.public_id = req.files[paths.upload].originalname.substring(0, req.files[paths.upload].originalname.lastIndexOf('.'));
			}

			if (field.options.autoCleanup && item.get(field.paths.exists)) {
				// capture image delete promise
				imageDelete = field.apply(item, 'delete');
			}

			// callback to be called upon completion of the 'upload' method
			var uploadComplete = function (result) {
				if (result.error) {
					callback(result.error);
				} else {
					item.set(field.path, result);
					callback();
				}
			};

			// upload immediately if image is not being delete
			if (typeof imageDelete === 'undefined') {
				field.apply(item, 'upload', req.files[paths.upload].path, uploadOptions).then(uploadComplete);
			} else {
				// otherwise wait until image is deleted before uploading
				// this avoids problems when deleting/uploading images with the same public_id (issue #598)
				imageDelete.then(function (result) {
					if (result.error) {
						callback(result.error);
					} else {
						field.apply(item, 'upload', req.files[paths.upload].path, uploadOptions).then(uploadComplete);
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
cloudinaryimage.prototype.handleRequest = function (item, req, paths, callback) {
	this.getRequestHandler(item, req, paths, callback)();
};

/*!
 * Export class
 */
module.exports = cloudinaryimage;
