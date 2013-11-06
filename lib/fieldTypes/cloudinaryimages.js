/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	keystone = require('../../'),
	util = require('util'),
	cloudinary = require('cloudinary'),
	utils = require('keystone-utils'),
	super_ = require('../field'),
	async = require('async');

/**
 * CloudinaryImages FieldType Constructor
 * @extends Field
 * @api public
 */

function cloudinaryimages(list, path, options) {
	this._underscoreMethods = ['format'];
	// TODO: implement filtering, hard-coded as disabled for now
	options.nofilter = true;
	cloudinaryimages.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(cloudinaryimages, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 * 
 * @api public
 */

cloudinaryimages.prototype.addToSchema = function() {
	
	var mongoose = keystone.mongoose;
	
	var field = this,
		schema = this.list.schema;
	
	var paths = this.paths = {
		upload: 		this._path.append('_upload'),
		action: 		this._path.append('_action'),
		order: 			this._path.append('_order')
	};
	
	var ImageSchema = new mongoose.Schema({
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
	
	var src  = function(img, options) {
		if (keystone.get('cloudinary secure')) {
			options = options || {};
			options.secure = true;
		}
		return img.public_id ? cloudinary.url(img.public_id + '.' + img.format, options) : '';
	}
	
	var addSize = function(options, width, height) {
		if (width) options.width = width;
		if (height) options.height = height;
		return options;
	};
	
	ImageSchema.method('src', function(options) {
		return src(this, options);
	});
	
	ImageSchema.method('scale', function(width, height) {
		return src(this, addSize({ crop: 'scale' }, width, height));
	});
	
	ImageSchema.method('fill', function(width, height) {
		return src(this, addSize({ crop: 'fill', gravity: 'faces' }, width, height));
	});
	
	ImageSchema.method('lfill', function(width, height) {
		return src(this, addSize({ crop: 'lfill', gravity: 'faces' }, width, height));
	});
	
	ImageSchema.method('fit', function(width, height) {
		return src(this, addSize({ crop: 'fit' }, width, height));
	});
	
	ImageSchema.method('limit', function(width, height) {
		return src(this, addSize({ crop: 'limit' }, width, height));
	});
	
	ImageSchema.method('pad', function(width, height) {
		return src(this, addSize({ crop: 'pad' }, width, height));
	});
	
	ImageSchema.method('lpad', function(width, height) {
		return src(this, addSize({ crop: 'lpad' }, width, height));
	});
	
	ImageSchema.method('crop', function(width, height) {
		return src(this, addSize({ crop: 'crop', gravity: 'faces' }, width, height));
	});
	
	ImageSchema.method('thumbnail', function(width, height) {
		return src(this, addSize({ crop: 'thumb', gravity: 'faces' }, width, height));
	});
	
	schema.add(this._path.addTo({}, [ImageSchema]));
	
	this.removeImage = function(item, id, method, callback) {
		var images = item.get(field.path);
		if ('number' != typeof id) {
			for (var i = 0; i < images.length; i++) {
				if (images[i].public_id == id) {
					id = i;
					break;
				}
			}
		}
		var img = images[i];
		if (!img) return;
		if (method == 'delete') {
			cloudinary.uploader.destroy(img.public_id, function() {});
		}
		images.splice(id, 1);
		if (callback) {
			item.save(('function' != typeof callback) ? callback : undefined);
		}
	}
	
	this.underscoreMethod('remove', function(id, callback) {
		field.removeImage(this, id, 'remove', callback);
	});
	
	this.underscoreMethod('delete', function(id, callback) {
		field.removeImage(this, id, 'delete', callback);
	});
	
	this.bindUnderscoreMethods();
}


/**
 * Formats the field value
 * 
 * @api public
 */

cloudinaryimages.prototype.format = function(item) {
	return _.map(item.get(this.path), function(img) {
		return img.src();
	}).join(', ');
}


/**
 * Detects whether the field has been modified
 * 
 * @api public
 */

cloudinaryimages.prototype.isModified = function(item) {
	// TODO - how should this be detected?
	return true;
}


/**
 * Validates that a value for this field has been provided in a data object
 * 
 * @api public
 */

cloudinaryimages.prototype.validateInput = function(data) {
	// TODO - how should image field input be validated?
	return true;
}


/**
 * Updates the value for this field in the item from a data object
 * 
 * @api public
 */

cloudinaryimages.prototype.updateItem = function(item, data) {
	// TODO - direct updating of data (not via upload)
}


/**
 * Returns a callback that handles a standard form submission for the field
 * 
 * Expected form parts are
 * - `field.paths.action` in `req.body` in syntax `delete:public_id,public_id|remove:public_id,public_id`
 * - `field.paths.upload` in `req.files` (uploads the images to cloudinary)
 * 
 * @api public
 */

cloudinaryimages.prototype.getRequestHandler = function(item, req, callback) {
	
	var field = this;
	
	callback = callback || function() {};
	
	return function() {
		
		if (req.body && req.body[field.paths.action]) {
			var actions = req.body[field.paths.action].split('|');
			
			actions.forEach(function(action) {
				action = action.split(':');
				var method = action[0],
					ids = action[1];
				
				if (!method.match(/^(remove|delete)$/) || !ids) return;
				
				ids.split(',').forEach(function(id) {
					field.removeImage(item, id, method);
				});
			});
		}
		
		if (req.files && req.files[field.paths.upload]) {
			
			var files = _.flatten(req.files[field.paths.upload]);
			
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
			
			async.each(files, function(file, next) {
			
				if (!file.size) return next();
				
				cloudinary.uploader.upload(file.path, function(result) {
					if (result.error) {
						return next(result.error);
					} else {
						item.get(field.path).push(result);
						return next();
					}
				}, uploadOptions);
			
			}, function(err) {
				return callback(err);
			});
			
		} else {
			return callback();
		}
		
	}
	
}


/**
 * Immediately handles a standard form submission for the field (see `getRequestHandler()`)
 * 
 * @api public
 */

cloudinaryimages.prototype.handleRequest = function(item, req, callback) {
	this.getRequestHandler(item, req, callback)();
}


/*!
 * Export class
 */

exports = module.exports = cloudinaryimages;
