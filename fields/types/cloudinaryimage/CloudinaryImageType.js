var _ = require('lodash');
var assign = require('object-assign');
var ensureCallback = require('keystone-storage-namefunctions/ensureCallback');
var FieldType = require('../Type');
var keystone = require('../../../');
var nameFunctions = require('keystone-storage-namefunctions');
var prototypeMethods = require('keystone-storage-namefunctions/prototypeMethods');
var sanitize = require('sanitize-filename');
var util = require('util');
var utils = require('keystone-utils');

/*
var CLOUDINARY_FIELDS = ['public_id', 'version', 'signature', 'format', 'resource_type', 'url', 'width', 'height', 'secure_url'];
*/

var DEFAULT_OPTIONS = {
	// This makes Cloudinary assign a unique public_id and is the same as
	//   the legacy implementation
	generateFilename: () => undefined,
	whenExists: 'overwrite',
	retryAttempts: 3, // For whenExists: 'retry'.
};

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
	this._properties = ['select', 'selectPrefix', 'autoCleanup'];

	if (options.filenameAsPublicID) {
		// Produces the same result as the legacy filenameAsPublicID option
		options.generateFilename = nameFunctions.originalFilename;
		options.whenExists = 'overwrite';
	}
	options = assign({}, DEFAULT_OPTIONS, options);
	options.generateFilename = ensureCallback(options.generateFilename);

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
cloudinaryimage.properName = 'CloudinaryImage';
util.inherits(cloudinaryimage, FieldType);

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
 */
cloudinaryimage.prototype.addToSchema = function (schema) {

	var cloudinary = require('cloudinary');

	var field = this;

	var paths = this.paths = {
		// cloudinary fields
		public_id: this.path + '.public_id',
		version: this.path + '.version',
		signature: this.path + '.signature',
		format: this.path + '.format',
		resource_type: this.path + '.resource_type',
		url: this.path + '.url',
		width: this.path + '.width',
		height: this.path + '.height',
		secure_url: this.path + '.secure_url',
		// virtuals
		exists: this.path + '.exists',
		folder: this.path + '.folder',
		// form paths
		select: this.path + '_select',
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
		options.format = options.format || item.get(paths.format);

		return cloudinary.url(item.get(paths.public_id), options);
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
			return field.getFolder();
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
			var promise = new Promise(function (resolve) {
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
			var promise = new Promise(function (resolve) {
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
 */
cloudinaryimage.prototype.format = function (item) {
	return item.get(this.paths.url);
};

/**
 * Gets the field's data from an Item, as used by the React components
 */
cloudinaryimage.prototype.getData = function (item) {
	var value = item.get(this.path);
	return typeof value === 'object' ? value : {};
};

cloudinaryimage.prototype._originalGetOptions = cloudinaryimage.prototype.getOptions;

cloudinaryimage.prototype.getOptions = function () {
	this._originalGetOptions();
	// We are performing the check here, so that if cloudinary secure is added
	// to keystone after the model is registered, it will still be respected.
	// Setting secure overrides default `cloudinary secure`
	if ('secure' in this.options) {
		this.__options.secure = this.options.secure;
	} else if (keystone.get('cloudinary secure')) {
		this.__options.secure = keystone.get('cloudinary secure');
	}
	return this.__options;
};

/**
 * Detects whether the field has been modified
 */
cloudinaryimage.prototype.isModified = function (item) {
	return item.isModified(this.paths.public_id);
};


function validateInput (value) {
	// undefined values are always valid
	if (value === undefined || value === null || value === '') return true;
	// If a string is provided, check it is an upload or delete instruction
	// TODO: This should really validate files as well, but that's not pased to this method
	if (typeof value === 'string' && /^(upload\:)|(delete$)|(data:[a-z\/]+;base64)|(https?\:\/\/)/.test(value)) return true;
	// If the value is an object and has a cloudinary public_id, it is valid
	if (typeof value === 'object' && value.public_id) return true;
	// None of the above? we can't recognise it.
	return false;
}

/**
 * Validates that a value for this field has been provided in a data object
 */
cloudinaryimage.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	var result = validateInput(value);
	utils.defer(callback, result);
};

/**
 * Validates that input has been provided
 */
cloudinaryimage.prototype.validateRequiredInput = function (item, data, callback) {
	// TODO: We need to also get the `files` argument, so we can check for
	// uploaded files. without it, this will return false negatives so we
	// can't actually validate required input at the moment.
	var result = true;
	// var value = this.getValueFromData(data);
	// var result = (value || item.get(this.path).public_id) ? true : false;
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
 * Trim supported file extensions from the public id because cloudinary uses these at
 * the end of the a url to dynamically convert the image filetype
 */
function trimSupportedFileExtensions (publicId) {
	var supportedExtensions = [
		'.jpg', '.jpe', '.jpeg', '.jpc', '.jp2', '.j2k', '.wdp', '.jxr',
		'.hdp', '.png', '.gif', '.webp', '.bmp', '.tif', '.tiff', '.ico',
		'.pdf', '.ps', '.ept', '.eps', '.eps3', '.psd', '.svg', '.ai',
		'.djvu', '.flif', '.tga',
	];
	for (var i = 0; i < supportedExtensions.length; i++) {
		var extension = supportedExtensions[i];
		if (_.endsWith(publicId, extension)) {
			return publicId.slice(0, -extension.length);
		}
	}
	return publicId;
}

/**
 * Updates the value for this field in the item from a data object
 * TODO: It is not possible to remove an existing value and upload a new image
 * in the same action, this should be supported
 */
cloudinaryimage.prototype.updateItem = function (item, data, files, callback) {
	// Process arguments
	if (typeof files === 'function') {
		callback = files;
		files = {};
	}
	if (!files) {
		files = {};
	}

	var cloudinary = require('cloudinary');
	var field = this;

	// Prepare values
	var value = this.getValueFromData(data);
	var uploadedFile;

	// Providing the string "remove" removes the file and resets the field
	if (value === 'remove') {
		cloudinary.uploader.destroy(item.get(field.paths.public_id), function (result) {
			if (result.error) {
				callback(result.error);
			} else {
				item.set(field.path, getEmptyValue());
				callback();
			}
		});
		return;
	}

	// Find an uploaded file in the files argument, either referenced in the
	// data argument or named with the field path / field_upload path + suffix
	// Base64 data and remote URLs are also accepted as images to upload
	if (typeof value === 'string' && value.substr(0, 7) === 'upload:') {
		uploadedFile = files[value.substr(7)];
	} else if (typeof value === 'string' && /^(data:[a-z\/]+;base64)|(https?\:\/\/)/.test(value)) {
		uploadedFile = { path: value };
	} else {
		uploadedFile = this.getValueFromData(files) || this.getValueFromData(files, '_upload');
	}

	// Ensure a valid file was uploaded, else null out the value
	if (uploadedFile && !uploadedFile.path) {
		uploadedFile = undefined;
	}

	// If we have a file to upload, we do that and stop here
	if (uploadedFile) {
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
		this.getFilename(uploadedFile, function (err, filename) {
			if (err) return callback(err);
			// If an undefined filename is returned, Cloudinary will automatically generate a unique
			//   filename. Therefore undefined is a valid filename value.
			if (filename !== undefined) {
				filename = sanitize(filename);
				uploadOptions.public_id = trimSupportedFileExtensions(filename);
			}
			// TODO: implement autoCleanup; should delete existing images before uploading
			cloudinary.uploader.upload(uploadedFile.path, function (result) {
				if (result.error) {
					return callback(result.error);
				} else {
					item.set(field.path, result);
					return callback();
				}
			}, uploadOptions);
		});

		return;
	}

	// Empty / null values reset the field
	if (value === null || value === '' || (typeof value === 'object' && !Object.keys(value).length)) {
		value = getEmptyValue();
	}

	// If there is a valid value at this point, set it on the field
	if (typeof value === 'object') {
		item.set(this.path, value);
	}
	utils.defer(callback);
};

/**
	Generates a filename with the provided method in a retry loop, used by
	getFilename below
*/
cloudinaryimage.prototype.retryFilename = prototypeMethods.retryFilename;

/**
	Gets a filename for uploaded files based on the adapter options
*/
cloudinaryimage.prototype.getFilename = prototypeMethods.getFilename;

cloudinaryimage.prototype.fileExists = function (filename, callback) {
	var cloudinary = require('cloudinary');
	cloudinary.api.resource(filename, function (result) {
		if (result.error && result.error.http_code === 404) {
			// File doesn't exist
			callback(null, false);
		} else if (result.error) {
			// Error
			callback(result.error, null);
		} else {
			// File exists
			callback(null, true);
		}
	});
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

	var cloudinary = require('cloudinary');
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

/* Export Field Type */
module.exports = cloudinaryimage;
