/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	keystone = require('../../'),
	util = require('util'),
	knox = require('knox'),
	// s3 = require('s3'),
	utils = require('keystone-utils'),
	super_ = require('../field');

/**
 * S3File FieldType Constructor
 * @extends Field
 * @api public
 */

function s3file(list, path, options) {
	this._underscoreMethods = ['format'];
	// TODO: implement filtering, hard-coded as disabled for now
	options.nofilter = true;
	s3file.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(s3file, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 * 
 * @api public
 */

s3file.prototype.addToSchema = function() {
	
	var field = this,
		schema = this.list.schema;
	
	var paths = this.paths = {
		// fields
		filename:		this._path.append('.filename'),
		path:			this._path.append('.path'),
		size:			this._path.append('.size'),
		filetype:		this._path.append('.filetype'),
		url:			this._path.append('.url'),
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
		url:			String
	});
	
	schema.add(schemaPaths);
	
	var exists = function(item) {
		return (item.get(paths.url) ? true : false);
	}
	
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
	}
	
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
			reset(this);
		},
		/**
		 * Deletes the file from S3File and resets the field
		 * 
		 * @api public
		 */
		delete: function() {
			try {
				var client = knox.createClient(keystone.get('s3file config'));
				client.deleteFile(this.get(paths.path) + this.get(paths.filename), function(err, res){ res ? res.resume() : false });
			} catch(e) {}
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

s3file.prototype.format = function(item) {
	return item.get(this.paths.url);
}


/**
 * Detects whether the field has been modified
 * 
 * @api public
 */

s3file.prototype.isModified = function(item) {
	return item.isModified(this.paths.url);
}


/**
 * Validates that a value for this field has been provided in a data object
 * 
 * @api public
 */

s3file.prototype.validateInput = function(data) {
	// TODO - how should file field input be validated?
	return true;
}


/**
 * Updates the value for this field in the item from a data object
 * 
 * @api public
 */

s3file.prototype.updateItem = function(item, data) {
	// TODO - direct updating of data (not via upload)
}


/**
 * Returns a callback that handles a standard form submission for the field
 * 
 * Expected form parts are
 * - `field.paths.action` in `req.body` (`clear` or `delete`)
 * - `field.paths.upload` in `req.files` (uploads the file to s3file)
 * 
 * @api public
 */

s3file.prototype.getRequestHandler = function(item, req, callback) {
	
	var field = this;
	
	callback = callback || function() {};
	
	return function() {
		
		if (req.body) {
			var action = req.body[field.paths.action];
			
			if (/^(delete|reset)$/.test(action))
				field.apply(item, action);
		}
		
		if (req.files && req.files[field.paths.upload] && req.files[field.paths.upload].size) {
			
			var file = req.files[field.paths.upload],
				path = field.options.s3path ? field.options.s3path + '/' : '',
				prefix = field.options.datePrefix ? moment().format(field.options.datePrefix) + '-' : '';
			
			var name = prefix + file.name;
			
			var client = knox.createClient(keystone.get('s3file config'));
			
			client.putFile(file.path, path + name, {
				'Content-Type': file.type,
				'x-amz-acl': 'public-read'
			}, function(err, res) {
				if (res) {
					res.resume();
				}
				if (err) {
					console.log('Error uploading Amazon S3 file.');
					callback(true);
				} else {
					item.set(field.path, {
						filename: name,
						path: path,
						size: file.size,
						filetype: file.type,
						url: res.req.url
					});
					callback();
				}
			});
			
			// Alternative method via S3 module, which provides helpful events for uploading files, leaving for future reference
			/*
			var client = s3.createClient(keystone.get('s3file config'));
			
			var headers = {
				'Content-Type': file.type,
				'x-amz-acl': 'public-read'
			};
			
			var uploader = client.upload(file.path, file.name, headers);
			
			uploader.on('error', function(res) {
				console.log('Error uploading Amazon S3 file:', res.stack);
				callback(res.stack);
			});
			
			uploader.on('progress', function(amountDone, amountTotal) {
				console.log('Amazon S3 file progress: ' + amountDone + ' of ' + amountTotal);
			});
			
			uploader.on('end', function(url) {
				item.set(field.path, {
					filename: file.name,
					size: file.size,
					filetype: file.type,
					url: url
				});
				callback();
			});
			*/
			
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

s3file.prototype.handleRequest = function(item, req, callback) {
	this.getRequestHandler(item, req, callback)();
}


/*!
 * Export class
 */

exports = module.exports = s3file;
