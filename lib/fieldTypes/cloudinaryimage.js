/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	keystone = require('../../'),
	util = require('util'),
	cloudinary = require('cloudinary'),
	utils = require('keystone-utils'),
	super_ = require('../field');

/**
 * CloudinaryImage FieldType Constructor
 * @extends Field
 * @api public
 */

function cloudinaryimage(list, path, options) {
	
	this._underscoreMethods = ['format'];
	
	// TODO: implement filtering, usage disabled for now
	options.nofilter = true;
	
	// TODO: implement initial form, usage disabled for now
	if (options.initial) {
		throw new Error('Invalid Configuration\n\n' +
			'CloudinaryImage fields (' + list.key + '.' + path + ') do not currently support being used as initial fields.\n');
	}
	
	cloudinaryimage.super_.call(this, list, path, options);
	
	// validate cloudinary config
	if (!keystone.get('cloudinary config')) {
		throw new Error('Invalid Configuration\n\n' +
			'CloudinaryImage fields (' + list.key + '.' + this.path + ') require the "cloudinary config" option to be set.\n\n' + 
			'See http://keystonejs.com/docs/configuration/#cloudinary for more information.\n');
	}
	
};

/*!
 * Inherit from Field
 */
 
util.inherits(cloudinaryimage, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 * 
 * @api public
 */

cloudinaryimage.prototype.addToSchema = function() {
	
	var field = this,
		schema = this.list.schema;
	
	var paths = this.paths = {
		// cloudinary fields
		public_id: 		this._path.append('.public_id'),
		version: 		this._path.append('.version'),
		signature: 		this._path.append('.signature'),
		format: 		this._path.append('.format'),
		resource_type: 	this._path.append('.resource_type'),
		url: 			this._path.append('.url'),
		width: 			this._path.append('.width'),
		height: 		this._path.append('.height'),
		secure_url: 	this._path.append('.secure_url'),
		// virtuals
		exists: 		this._path.append('.exists'),
		upload: 		this._path.append('_upload'),
		action: 		this._path.append('_action')
	};
	
	var schemaPaths = this._path.addTo({}, {
		public_id:		String,
		version:		Number,
		signature:		String,
		format:			String,
		resource_type:	String,
		url:			String,
		width:			Number,
		height:			Number,
		secure_url:		String
	});
	
	schema.add(schemaPaths);
	
	var exists = function(item) {
		return (item.get(paths.public_id) ? true : false);
	}
	
	// The .exists virtual indicates whether an image is stored
	schema.virtual(paths.exists).get(function() {
		return schemaMethods.exists.apply(this);
	});
	
	var src = function(item, options) {
		
		if (!exists(item)) {
			return '';
		}
		
		options = ('object' == typeof options) ? options : {};
		
		if (!('fetch_format' in options) && keystone.get('cloudinary webp') !== false) {
			options.fetch_format = "auto";
		}
		
		if (!('progressive' in options) && keystone.get('cloudinary progressive') !== false) {
			options.progressive = true;
		}
		
		if (!('secure' in options) && keystone.get('cloudinary secure')) {
			options.secure = true;
		}
		
		return cloudinary.url(item.get(paths.public_id) + '.' + item.get(paths.format), options);
		
	}
	
	var reset = function(item) {
		item.set(field.path, {
			public_id: '',
			version: 0,
			signature: '',
			format: '',
			resource_type: '',
			url: '',
			width: 0,
			height: 0,
			secure_url: ''
		});
	}
	
	var addSize = function(options, width, height, other) {
		if (width) options.width = width;
		if (height) options.height = height;
		if ('object' == typeof other) {
			_.extend(options, other);
		}
		return options;
	};
	
	var schemaMethods = {
		exists: function() {
			return exists(this);
		},
		src: function(options) {
			return src(this, options);
		},
		tag: function(options) {
			return exists(this) ? cloudinary.image(this.get(field.path), options) : '';
		},
		scale: function(width, height, options) {
			return src(this, addSize({ crop: 'scale' }, width, height, options));
		},
		fill: function(width, height, options) {
			return src(this, addSize({ crop: 'fill', gravity: 'faces' }, width, height, options));
		},
		lfill: function(width, height, options) {
			return src(this, addSize({ crop: 'lfill', gravity: 'faces' }, width, height, options));
		},
		fit: function(width, height, options) {
			return src(this, addSize({ crop: 'fit' }, width, height, options));
		},
		limit: function(width, height, options) {
			return src(this, addSize({ crop: 'limit' }, width, height, options));
		},
		pad: function(width, height, options) {
			return src(this, addSize({ crop: 'pad' }, width, height, options));
		},
		lpad: function(width, height, options) {
			return src(this, addSize({ crop: 'lpad' }, width, height, options));
		},
		crop: function(width, height, options) {
			return src(this, addSize({ crop: 'crop', gravity: 'faces' }, width, height, options));
		},
		thumbnail: function(width, height, options) {
			return src(this, addSize({ crop: 'thumb', gravity: 'faces' }, width, height, options));
		},
		/**
		 * Resets the value of the field
		 * 
		 * @api public
		 */
		reset: function() {
			reset(this);
		},
		/**
		 * Deletes the image from Cloudinary and resets the field
		 * 
		 * @api public
		 */
		delete: function() {
			cloudinary.uploader.destroy(this.get(paths.public_id), function() {});
			reset(this);
		}
	}
	
	_.each(schemaMethods, function(fn, key) {
		field.underscoreMethod(key, fn);
	});
	
	// expose a method on the field to call schema methods
	this.apply = function(item, method) {
		return schemaMethods[method].apply(item, Array.prototype.slice.call(arguments, 2));
	};
	
	this.bindUnderscoreMethods();
}


/**
 * Formats the field value
 * 
 * @api public
 */

cloudinaryimage.prototype.format = function(item) {
	return item.get(this.paths.url);
}


/**
 * Detects whether the field has been modified
 * 
 * @api public
 */

cloudinaryimage.prototype.isModified = function(item) {
	return item.isModified(this.paths.url);
}


/**
 * Validates that a value for this field has been provided in a data object
 * 
 * @api public
 */

cloudinaryimage.prototype.validateInput = function(data) {
	// TODO - how should image field input be validated?
	return true;
}


/**
 * Updates the value for this field in the item from a data object
 * 
 * @api public
 */

cloudinaryimage.prototype.updateItem = function(item, data) {
	// TODO - direct updating of data (not via upload)
}


/**
 * Returns a callback that handles a standard form submission for the field
 * 
 * Expected form parts are
 * - `field.paths.action` in `req.body` (`clear` or `delete`)
 * - `field.paths.upload` in `req.files` (uploads the image to cloudinary)
 * 
 * @api public
 */

cloudinaryimage.prototype.getRequestHandler = function(item, req, paths, callback) {
	
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
			
			var tp = keystone.get('cloudinary prefix') || '';
			
			if (tp.length)
				tp += '_';
			
			var uploadOptions = {
				tags: [tp + field.list.path + '_' + field.path, tp + field.list.path + '_' + field.path + '_' + item.id]
			}
			
			if (keystone.get('cloudinary prefix'))
				uploadOptions.tags.push(keystone.get('cloudinary prefix'));
			
			if (keystone.get('env') != 'production')
				uploadOptions.tags.push(tp + 'dev');
			
			cloudinary.uploader.upload(req.files[paths.upload].path, function(result) {
				if (result.error) {
					callback(result.error);
				} else {
					item.set(field.path, result);
					callback();
				}
			}, uploadOptions);
			
		} else {
			callback();
		}
		
	}
	
}


/**
 * Immediately handles a standard form submission for the field (see `getRequestHandler()`)
 * 
 * @api public
 */

cloudinaryimage.prototype.handleRequest = function(item, req, paths, callback) {
	this.getRequestHandler(item, req, paths, callback)();
}


/*!
 * Export class
 */

exports = module.exports = cloudinaryimage;
