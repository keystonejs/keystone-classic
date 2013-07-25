/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	util = require('util'),
	cloudinary = require('cloudinary'),
	keystone = require('../../'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * Image FieldType Constructor
 * @extends Field
 * @api public
 */

function cloudimage(list, path, options) {
	cloudimage.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(cloudimage, super_);

/**
 * Registers the field on the List's Mongoose Schema.
 * 
 * @api public
 */
cloudimage.prototype.addToSchema = function() {
	
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
		methods: 		this._path.append('.methods'),
		upload: 		this._path.append('_upload'),
		action: 		this._path.append('_action')
	};
	
	schema.nested[this.path] = true;
	schema.add({
		public_id:		String,
		version:		Number,
		signature:		String,
		format:			String,
		resource_type:	String,
		url:			String,
		width:			Number,
		height:			Number,
		secure_url:		String
	}, this.path + '.');
	
	// The .exists virtual indicates whether an image is stored
	var exists = function(item) {
		return (item.get(paths.public_id) ? true : false);
	}
	
	schema.virtual(paths.exists).get(function() {
		return exists(this);
	});
	
	schema.methods[this._path.append('.tag')] = function(options) {
		return exists(this) ? cloudinary.image(this.get(field.path), options) : '';
	}
	
	var src = function(item, options) {
		return exists(item) ? cloudinary.url(item.get(paths.public_id) + '.' + item.get(paths.format), options) : '';
	}
	
	schema.methods[this._path.append('.src')] = function(options) {
		return src(this, options);
	}
	schema.methods[this._path.append('.fit')] = function(width, height) {
		return src(this, { width: width, height: height, crop: 'fit' });
	}
	schema.methods[this._path.append('.limit')] = function(width, height) {
		return src(this, { width: width, height: height, crop: 'limit' });
	}
	schema.methods[this._path.append('.fill')] = function(width, height) {
		return src(this, { width: width, height: height, crop: 'fill', gravity: 'faces' });
	}
	schema.methods[this._path.append('.crop')] = function(width, height) {
		return src(this, { width: width, height: height, crop: 'crop', gravity: 'faces' });
	}
	schema.methods[this._path.append('.thumbnail')] = function(width, height) {
		return src(this, { width: width, height: height, crop: 'thumb', gravity: 'faces' });
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
	
	var del = function(item) {
		cloudinary.uploader.destroy(item.get(paths.public_id), function() {});
		reset(item);
	}
	
	schema.methods[this._path.append('.reset')] = function(width, height) {
		return reset(this);
	}
	
	schema.methods[this._path.append('.delete')] = function(width, height) {
		return del(this);
	}
	
	// INTERNAL USE ONLY
	// These methods are indentical to those defined on the schema.
	// This is a workaround to provide the methods through a getter when you have to use a dynamic path (i.e. `item.get(field.paths.methods)`)
	// Required for Keystone's dynamic UI but not recommended for any other use.
	schema.virtual(paths.methods).get(function() {
		
		var item = this;
		
		m = {
			tag: function(options) {
				return exists(this) ? cloudinary.image(item.get(field.path), options) : '';
			},
			src: function(options) {
				return src(item, options);
			},
			fit: function(width, height) {
				return src(item, { width: width, height: height, crop: 'fit' });
			},
			limit: function(width, height) {
				return src(item, { width: width, height: height, crop: 'limit' });
			},
			fill: function(width, height) {
				return src(item, { width: width, height: height, crop: 'fill', gravity: 'faces' });
			},
			crop: function(width, height) {
				return src(item, { width: width, height: height, crop: 'crop', gravity: 'faces' });
			},
			thumbnail: function(width, height) {
				return src(item, { width: width, height: height, crop: 'thumb', gravity: 'faces' });
			},
			reset: function() {
				return reset(item);
			},
			delete: function() {
				return del(item);
			}
		}
		
		return m;
		
	});
}

/**
 * Formats the field value
 * 
 * @api public
 */
cloudimage.prototype.format = function(item) {
	return item.get(this.paths.url);
}

/**
 * Validates that a value for this field has been provided in a data object
 * 
 * @api public
 */
cloudimage.prototype.validateInput = function(data) {
	// TODO
	return true;
}

/**
 * Updates the value for this field in the item from a data object
 * 
 * @api public
 */
cloudimage.prototype.updateItem = function(item, data) {
	// TODO
}

/**
 * Deletes the image from Cloudinary and resets the field
 * 
 * @api public
 */
cloudimage.prototype.delete = function(item) {
	item.get(this.paths.methods).delete();
}

/**
 * Resets the value of the field
 * 
 * @api public
 */
cloudimage.prototype.reset = function(item) {
	item.get(this.paths.methods).reset();
}

/**
 * Returns a callback that handles a standard form submission for the field
 * 
 * Expeced form parts are
 * -   `field.paths.action` in `req.body` (`clear` or `delete`)
 * -   `field.paths.upload` in `req.files` (uploads the image to cloudinary)
 * 
 * @api public
 */
cloudimage.prototype.getRequestHandler = function(item, req, callback) {
	
	var field = this;
	
	callback = callback || function() {};
	
	return function() {
		
		if (req.body) {
			var action = req.body[field.paths.action];
			
			if (/^(delete|reset)$/.test(action))
				field[action](item);
		}
		
		if (req.files && req.files[field.paths.upload] && req.files[field.paths.upload].size) {
			
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
			
			cloudinary.uploader.upload(req.files[field.paths.upload].path, function(result) {
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
cloudimage.prototype.handleRequest = function(item, req, callback) {
	this.getRequestHandler(item, req, callback)();
}

exports = module.exports = cloudimage;
