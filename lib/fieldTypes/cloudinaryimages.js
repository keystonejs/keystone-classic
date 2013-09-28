/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	keystone = require('../../'),
	util = require('util'),
	cloudinary = require('cloudinary'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * CloudinaryImages FieldType Constructor
 * @extends Field
 * @api public
 */

function cloudinaryimages(list, path, options) {
	this._format = true;
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
		action: 		this._path.append('_action')
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
	
	ImageSchema.method('src', function(options) {
		return src(this, options);
	});
	
	ImageSchema.method('fit', function(width, height) {
		return src(this, { width: width, height: height, crop: 'fit' });
	});
	
	schema.add(this._path.addTo({}, [ImageSchema]));
	
	field.underscoreMethod('delete', function(i) {
		// find the image at index i
		// if it exists, delete it like...
		// cloudinary.uploader.destroy(this.get(paths.public_id), function() {});
		// then remove it from the array using array.splice() (mongoose method w/ change tracking)
	});
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
	return item.isModified(this.paths.url);
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
 * - `field.paths.action` in `req.body` (`clear` or `delete`)
 * - `field.paths.upload` in `req.files` (uploads the image to cloudinary)
 * 
 * @api public
 */

cloudinaryimages.prototype.getRequestHandler = function(item, req, callback) {
	
	var field = this;
	
	callback = callback || function() {};
	
	return function() {
		
		/*
		if (req.body) {
			var action = req.body[field.paths.action];
			
			if (/^(delete|reset)$/.test(action))
				field.apply(item, action);
		}
		*/
		
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

cloudinaryimages.prototype.handleRequest = function(item, req, callback) {
	this.getRequestHandler(item, req, callback)();
}


/*!
 * Export class
 */

exports = module.exports = cloudinaryimages;
