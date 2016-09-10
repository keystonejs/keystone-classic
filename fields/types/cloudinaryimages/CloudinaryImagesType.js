var _ = require('lodash');
var assign = require('object-assign');
var async = require('async');
var FieldType = require('../Type');
var keystone = require('../../../');
var util = require('util');
var utils = require('keystone-utils');

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

function truthy (value) {
	return value;
}

/**
 * CloudinaryImages FieldType Constructor
 */
function cloudinaryimages (list, path, options) {
	this._underscoreMethods = ['format'];
	this._fixedSize = 'full';
	this._properties = ['select', 'selectPrefix', 'autoCleanup', 'publicID', 'folder', 'filenameAsPublicID'];

	// TODO: implement filtering, usage disabled for now
	options.nofilter = true;

	cloudinaryimages.super_.call(this, list, path, options);

	// validate cloudinary config
	if (!keystone.get('cloudinary config')) {
		throw new Error('Invalid Configuration\n\n'
			+ 'CloudinaryImages fields (' + list.key + '.' + this.path + ') require the "cloudinary config" option to be set.\n\n'
			+ 'See http://keystonejs.com/docs/configuration/#services-cloudinary for more information.\n');
	}
}
cloudinaryimages.properName = 'CloudinaryImages';
util.inherits(cloudinaryimages, FieldType);

/**
 * Gets the folder for images in this field
 */
cloudinaryimages.prototype.getFolder = function () {
	var folder = null;

	if (keystone.get('cloudinary folders') || this.options.folder) {
		if (typeof this.options.folder === 'string') {
			folder = this.options.folder;
		} else {
			folder = this.list.path + '/' + this.path;
		}
	}

	return folder;
};

/**
 * Registers the field on the List's Mongoose Schema.
 */
cloudinaryimages.prototype.addToSchema = function (schema) {

	var cloudinary = require('cloudinary');
	var mongoose = keystone.mongoose;
	var field = this;

	this.paths = {
		// virtuals
		folder: this._path.append('.folder'),
		// form paths
		upload: this._path.append('_upload'),
		uploads: this._path.append('_uploads'),
		action: this._path.append('_action'),
		order: this._path.append('_order'),
	};

	var ImageSchema = new mongoose.Schema({
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

	// Generate cloudinary folder used to upload/select images
	var folder = function (item) { // eslint-disable-line no-unused-vars
		var folderValue = '';

		if (keystone.get('cloudinary folders')) {
			if (field.options.folder) {
				folderValue = field.options.folder;
			} else {
				var folderList = keystone.get('cloudinary prefix') ? [keystone.get('cloudinary prefix')] : [];
				folderList.push(field.list.path);
				folderList.push(field.path);
				folderValue = folderList.join('/');
			}
		}

		return folderValue;
	};

	// The .folder virtual returns the cloudinary folder used to upload/select images
	schema.virtual(field.paths.folder).get(function () {
		return folder(this);
	});

	var src = function (img, options) {
		if (keystone.get('cloudinary secure')) {
			options = options || {};
			options.secure = true;
		}
		options.format = options.format || img.format;
		return img.public_id ? cloudinary.url(img.public_id, options) : '';
	};

	var addSize = function (options, width, height, other) {
		if (width) options.width = width;
		if (height) options.height = height;
		if (typeof other === 'object') {
			assign(options, other);
		}
		return options;
	};
	ImageSchema.method('src', function (options) {
		return src(this, options);
	});
	ImageSchema.method('scale', function (width, height, options) {
		return src(this, addSize({ crop: 'scale' }, width, height, options));
	});
	ImageSchema.method('fill', function (width, height, options) {
		return src(this, addSize({ crop: 'fill', gravity: 'faces' }, width, height, options));
	});
	ImageSchema.method('lfill', function (width, height, options) {
		return src(this, addSize({ crop: 'lfill', gravity: 'faces' }, width, height, options));
	});
	ImageSchema.method('fit', function (width, height, options) {
		return src(this, addSize({ crop: 'fit' }, width, height, options));
	});
	ImageSchema.method('limit', function (width, height, options) {
		return src(this, addSize({ crop: 'limit' }, width, height, options));
	});
	ImageSchema.method('pad', function (width, height, options) {
		return src(this, addSize({ crop: 'pad' }, width, height, options));
	});
	ImageSchema.method('lpad', function (width, height, options) {
		return src(this, addSize({ crop: 'lpad' }, width, height, options));
	});
	ImageSchema.method('crop', function (width, height, options) {
		return src(this, addSize({ crop: 'crop', gravity: 'faces' }, width, height, options));
	});
	ImageSchema.method('thumbnail', function (width, height, options) {
		return src(this, addSize({ crop: 'thumb', gravity: 'faces' }, width, height, options));
	});

	schema.add(this._path.addTo({}, [ImageSchema]));

	this.removeImage = function (item, id, method, callback) {
		var images = item.get(field.path);
		if (typeof id !== 'number') {
			for (var i = 0; i < images.length; i++) {
				if (images[i].public_id === id) {
					id = i;
					break;
				}
			}
		}
		var img = images[id];
		if (!img) return;
		if (method === 'delete') {
			cloudinary.uploader.destroy(img.public_id, function () {});
		}
		images.splice(id, 1);
		if (callback) {
			item.save((typeof callback !== 'function') ? callback : undefined);
		}
	};
	this.underscoreMethod('remove', function (id, callback) {
		field.removeImage(this, id, 'remove', callback);
	});
	this.underscoreMethod('delete', function (id, callback) {
		field.removeImage(this, id, 'delete', callback);
	});
	this.bindUnderscoreMethods();
};

/**
 * Formats the field value
 */
cloudinaryimages.prototype.format = function (item) {
	return _.map(item.get(this.path), function (img) {
		return img.src();
	}).join(', ');
};

/**
 * Gets the field's data from an Item, as used by the React components
 */
cloudinaryimages.prototype.getData = function (item) {
	var value = item.get(this.path);
	return Array.isArray(value) ? value : [];
};

/**
 * Validates that a value for this field has been provided in a data object
 *
 * Deprecated
 */
cloudinaryimages.prototype.inputIsValid = function (data) { // eslint-disable-line no-unused-vars
	// TODO - how should image field input be validated?
	return true;
};

/**
 * Updates the value for this field in the item from a data object
 */
cloudinaryimages.prototype.updateItem = function (item, data, files, callback) {
	if (typeof files === 'function') {
		callback = files;
		files = {};
	} else if (!files) {
		files = {};
	}

	var cloudinary = require('cloudinary');
	var field = this;
	var values = this.getValueFromData(data);

	// TODO: This logic needs to block uploading of files from the data argument,
	// see CloudinaryImage for a reference on how it should be implemented

	// Early exit path: reset value when falsy, or bail if no value was provided
	if (!values) {
		if (values !== undefined) {
			item.set(field.path, []);
		}
		return process.nextTick(callback);
	}

	// When the value exists, but isn't an array, turn it into one (this just
	// means a single field was submitted in the formdata)
	if (!Array.isArray(values)) {
		values = [values];
	}

	// We cache options to avoid recalculating them on each iteration in the map below
	var cachedUploadOptions;
	function getUploadOptions () {
		if (cachedUploadOptions) {
			return cachedUploadOptions;
		}
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
		var folder = field.getFolder();
		if (folder) {
			uploadOptions.folder = folder;
		}
		cachedUploadOptions = uploadOptions;
		return uploadOptions;
	}

	// Preprocess values to deserialise JSON, detect mappings to uploaded files
	// and flatten out arrays
	values = values.map(function (value) {
		// When the value is a string, it may be JSON serialised data.
		if (typeof value === 'string'
			&& value.charAt(0) === '{'
			&& value.charAt(value.length - 1) === '}'
		) {
			try {
				return JSON.parse(value);
			} catch (e) { /* value isn't JSON */ }
		}
		if (typeof value === 'string') {
			// detect file upload (field value must be a reference to a field in the
			// uploaded files object provided by multer)
			if (value.substr(0, 7) === 'upload:') {
				var uploadFieldPath = value.substr(7);
				return files[uploadFieldPath];
			}
			// detect a URL or Base64 Data
			else if (/^(data:[a-z\/]+;base64)|(https?\:\/\/)/.test(value)) {
				return { path: value };
			}
		}
		return value;
	});
	values = _.flatten(values);

	async.map(values, function (value, next) {
		if (typeof value === 'object' && 'public_id' in value) {
			// Cloudinary Image data provided
			if (value.public_id) {
				// Default the object with empty values
				var v = assign(getEmptyValue(), value);
				return next(null, v);
			} else {
				// public_id is falsy, remove the value
				return next();
			}
		} else if (typeof value === 'object' && value.path) {
			// File provided - upload it
			var uploadOptions = getUploadOptions();
			// NOTE: field.options.publicID has been deprecated (tbc)
			if (field.options.filenameAsPublicID && value.originalname && typeof value.originalname === 'string') {
				uploadOptions = assign({}, uploadOptions, {
					public_id: value.originalname.substring(0, value.originalname.lastIndexOf('.')),
				});
			}
			// TODO: implement autoCleanup; should delete existing images before uploading
			cloudinary.uploader.upload(value.path, function (result) {
				if (result.error) {
					next(result.error);
				} else {
					next(null, result);
				}
			}, uploadOptions);
		} else {
			// Nothing to do
			// TODO: We should really also support deleting images from cloudinary,
			// see the CloudinaryImageType field for reference
			return next();
		}
	}, function (err, result) {
		if (err) return callback(err);
		result = result.filter(truthy);
		item.set(field.path, result);
		return callback();
	});
};

/**
 * Returns a callback that handles a standard form submission for the field
 *
 * Expected form parts are
 * - `field.paths.action` in `req.body` in syntax `delete:public_id,public_id|remove:public_id,public_id`
 * - `field.paths.upload` in `req.files` (uploads the images to cloudinary)
 */
cloudinaryimages.prototype.getRequestHandler = function (item, req, paths, callback) {

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

		// Order
		if (req.body[paths.order]) {
			var images = item.get(field.path);
			var newOrder = req.body[paths.order].split(',');

			images.sort(function (a, b) {
				return (newOrder.indexOf(a.public_id) > newOrder.indexOf(b.public_id)) ? 1 : -1;
			});
		}

		// Removals & Deletes
		if (req.body && req.body[paths.action]) {
			var actions = req.body[paths.action].split('|');

			actions.forEach(function (action) {
				action = action.split(':');
				var method = action[0];
				var ids = action[1];

				if (!method.match(/^(remove|delete)$/) || !ids) return;

				ids.split(',').forEach(function (id) {
					field.removeImage(item, id, method);
				});
			});
		}

		// Upload References (direct uploading)
		if (req.body[paths.uploads]) {
			var uploads = JSON.parse(req.body[paths.uploads]);

			uploads.forEach(function (file) {
				item.get(field.path).push(file);
			});
		}

		// Upload Data (form submissions)
		if (req.files && req.files[paths.upload]) {
			var files = [].concat(req.files[paths.upload]);

			var tp = keystone.get('cloudinary prefix') || '';

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


			async.each(files, function (file, next) {

				if (!file.size) return next();

				if (field.options.filenameAsPublicID) {
					uploadOptions.public_id = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
				}

				cloudinary.uploader.upload(file.path, function (result) {
					if (result.error) {
						return next(result.error);
					} else {
						item.get(field.path).push(result);
						return next();
					}
				}, uploadOptions);

			}, function (err) {
				return callback(err);
			});
		} else {
			return callback();
		}
	};
};

/*!
 * Export class
 */
module.exports = cloudinaryimages;
