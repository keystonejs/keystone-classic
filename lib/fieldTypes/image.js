/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	util = require('util'),
	cloudinary = require('cloudinary'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * Image FieldType Constructor
 * @extends Field
 * @api public
 */

function image(list, path, options) {
	image.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(image, super_);

/**
 * Registers the field on the List's Mongoose Schema.
 * 
 * @api public
 */
image.prototype.addToSchema = function() {
	
	var schema = this.list.schema;
	
	var paths = this.paths = {
		obj: 			this._path.exceptLast,
		public_id: 		this._path.append('.public_id'),
		version: 		this._path.append('.version'),
		signature: 		this._path.append('.signature'),
		format: 		this._path.append('.format'),
		resource_type: 	this._path.append('.resource_type'),
		url: 			this._path.append('.url'),
		width: 			this._path.append('.width'),
		height: 		this._path.append('.height'),
		secure_url: 	this._path.append('.secure_url'),
		exists: 		this._path.append('.exists'),
		methods: 		this._path.append('.methods'),
		upload: 		this._path.append('_upload')
	};
	
	var methods = {
		tag:			this._path.append('.tag'),
		src:			this._path.append('.src'),
		limit:			this._path.append('.limit')
	};
	
	schema.path(paths.public_id, String);
	schema.path(paths.version, Number);
	schema.path(paths.signature, String);
	schema.path(paths.format, String);
	schema.path(paths.resource_type, String);
	schema.path(paths.url, String);
	schema.path(paths.width, Number);
	schema.path(paths.height, Number);
	schema.path(paths.secure_url, String);
	
	// The .exists virtual indicates whether an image is stored
	schema.virtual(paths.exists).get(function() {
		return (this.get(paths.public_id) ? true : false);
	});
	
	schema.methods[methods.tag] = function(options) {
		return (this.get(paths.exists)) ? cloudinary.image(this.get(paths.obj), options) : '';
	}
	
	var src = function(item, options) {
		return cloudinary.url(item.get(paths.public_id) + '.' + item.get(paths.format), options);
	}
	
	schema.methods[methods.src] = function(options) {
		return src(this, options);
	}
	schema.methods[methods.limit] = function(width, height) {
		return cloudinary.url(this.get(paths.public_id) + '.' + this.get(paths.format), { width: width, height: height, crop: 'limit' });
	}
	
	// INTERNAL USE ONLY
	// These methods are indentical to those defined on the schema.
	// This is a workaround to provide the methods through a getter when you have to use a dynamic path (i.e. `item.get(field.paths.methods)`)
	// Required for Prospekt's dynamic UI but not recommended for any other use.
	schema.virtual(paths.methods).get(function() {
		
		var item = this,
			exists = this.get(paths.exists);
		
		m = {
			tag: function(options) {
				return exists ? cloudinary.image(item.get(paths.obj), options) : '';
			},
			src: function(options) {
				return exists ? cloudinary.url(item.get(paths.public_id) + '.' + item.get(paths.format), options) : '';
			},
			limit: function(options) {
				return m.src({ width: width, height: height, crop: 'limit' });
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
image.prototype.format = function(item) {
	return item.get(this.paths.url);
}

/**
 * Validates that a value for this field has been provided in a data object
 * 
 * @api public
 */
image.prototype.validateInput = function(data) {
	// TODO
	return true;
}

/**
 * Updates the value for this field in the item from a data object
 * 
 * @api public
 */
image.prototype.updateItem = function(item, data) {
	// TODO
}

exports = module.exports = image;
