/*!
 * Module dependencies.
 */

var path = require('path'),
	keystone = require('../../../'),
	_ = require('underscore'),
	async = require('async'),
	util = require('util'),
	utils = require('keystone-utils'),
	grappling = require('grappling-hook'),
	fs = require('fs'),
	super_ = require('../Type');
/**
 * File fieldtyppe
 * 
 * Options:
 *   - store (String) name of the Keystone Store to use
 *   - dest (String) the path for uploaded files, when supported by the storage provider
 *   - overwrite (Boolean true) whether uploading a new file deletes the old one
 *   - pre (Object { event: [Function(file)] }) adds pre-event hooks for `upload`, `download` and `remove`
 *   - post (Object { event: [Function(file)] }) adds post-event hooks for `upload`, `download` and `remove`
 *   - public (Boolean false) whether the file is publicly accessible
 *   - href (Function(file, item) => String) formats the value into a publicly accessible string
 *   - format (Function(file, item) => String) formats the value into a string for display, default to href()
 *   - prefix (String) simple prefix for the default href method
 *   - mimetype (String) allowed mime type, defaults mimetypes option
 *   - mimetypes (Array [String]) allowed mime types, used for validation
 *   - filename (String or Function(item, value) => String) changes the filename before upload
 * 
 *   When the filename option is a string, it is parsed for field paths from the item, e.g 'img-{id}'
 * 
 * Field methods:
 *   - format()
 *   - upload(file, progress, done)
 *     upload(file, done)
 *       - file (String | Stream) local path, remote path, file stream
 *       - progress (Function(transferredBytes, totalBytes))
 *       - done (Function(err, file))
 *   - download(dest, progress, done)
 *     download(progress, done)
 *     download(dest, done)
 *     download(done)
 *       - dest (String) local path to save the downloaded file to
 *       - progress (Function(transferredBytes, totalBytes))
 *       - done (Function(err, file))
 *   - remove(done)
 *   
 */

function file(list, path, options) {
	grappling.mixin(this)
		.allowHooks("upload", "download", "remove");
	
	this._underscoreMethods = ['format', 'uploadFile', 'deleteFile'];
	this._fixedSize = 'full';
	
	// TODO: implement filtering, usage disabled for now
	options.nofilter = true;


	_.each(options.pre, function(middleware, action) {
		this.pre(action, middleware);
	}, this);
	_.each(options.post, function(middleware, action) {
		this.post(action, middleware);
	}, this);

	var store = options.store;
	if (keystone.stores[store]) {
		this.store = keystone.stores[store];
	} else {
		throw new ReferenceError('unknown store ' + store);
	}

	file.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(file, super_);

file.prototype.getPaths = function() {
	return {
		filename:		String,
		originalname:	String,
		size:			Number,
		filetype:		String
	}	
};

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */

file.prototype.addToSchema = function() {
	
	var field = this,
		schema = this.list.schema,
		pathsConfig = this.store.getPaths(field.getPaths());
	
	var paths = this.paths = {
		// virtuals
		exists:			this._path.append('.exists'),
		href:			this._path.append('.href'),
		upload:			this._path.append('_upload'),
		action:			this._path.append('_action')
	};
	_.each(pathsConfig, function(type, name) {
		this.paths[name] = this._path.append("."+name);
	}, this);
	
	var schemaPaths = this._path.addTo({}, pathsConfig);
	schema.add(schemaPaths);
	
	// exists checks for a matching file at run-time
	var exists = function(item) {
		return field.fileExists(item, paths);
	};
	
	// The .exists virtual indicates whether a file is stored
	schema.virtual(paths.exists).get(function() {
		return schemaMethods.exists.apply(this);
	});
	
	// The .href virtual returns the public path of the file
	schema.virtual(paths.href).get(function() {
		return field.href.call(field, this);
	});
	
	// reset clears the value of the field
	var reset = function(item) {
		var data = {};
		_.each(pathsConfig, function(type, name) {
			var value;
			switch(type){
				case Number: value=0; break;
				default: value="";
			}
			data[name] = value;
		});
		item.set(field.path, data);
	};

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
		 * Deletes the file from file and resets the field
		 *
		 * @api public
		 */
		delete: function(callback) {
			//we want `reset` to happen in _any_ case (even if file deletion would fail)
			//but we also want to call the callback with potential file deletion errors
			var file = this.get(field.path);
			reset(this);
			if (exists(this)) {
				field.deleteFile(field, file, callback);
			}
		}
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
 * Delegates to the options.format function if it exists.
 * @api public
 */

file.prototype.format = function(item) {
	if (!item.get(this.paths.filename)) return '';
	if (this.hasFormatter()) {
		var file = item.get(this.path);
		file.href = this.href(item);
		return this.options.format.call(this, file, item);
	}
	return this.href(item);
};


/**
 * Detects whether the field has formatter function
 *
 * @api public
 */

file.prototype.hasFormatter = function() {
	return 'function' === typeof this.options.format;
};


/**
 * Return the public href for the stored file
 *
 * @api public
 */

file.prototype.href = function(item) {
	if (!item.get(this.paths.filename)) return '';
	var prefix = this.options.prefix ? this.options.prefix : item.get(this.paths.path);
	return path.join(prefix, item.get(this.paths.filename));
};


/**
 * Validates that a value for this field has been provided in a data object
 *
 * @api public
 */

file.prototype.validateInput = function(data) {
	// TODO - how should file field input be validated?
	return true;
};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

file.prototype.updateItem = function(item, data) {
	// TODO - direct updating of data (not via upload)
};

file.prototype.fileExists = function(file, data){
	this.store.fileExists.apply(this.store, _.toArray(arguments));
};

/**
 * Uploads a file
 *
 * @api public
 */

file.prototype.uploadFile = function(item, file, update, callback) {
	var self = this;

	this.callHook('pre:upload', [item, file], function(err) {
		if (err) return callback(err);
		self.store.uploadFile(self, item, file, function(err, data) {
			if (err) return callback(err);
			self.callHook('post:upload', [item, file, data], function(err) {
				if (!err && update) {
					item.set(self.path, data);
				}
				callback(err, data);
			});
		});
	});
};


/**
 * Deletes a file
 *
 * @api public
 */

file.prototype.deleteFile = function() {
	this.store.deleteFile.apply(this.store, _.toArray(arguments));
};


/**
 * Returns a callback that handles a standard form submission for the field
 *
 * Expected form parts are
 * - `field.paths.action` in `req.body` (`clear` or `delete`)
 * - `field.paths.upload` in `req.files` (uploads the file to file)
 *
 * @api public
 */

file.prototype.getRequestHandler = function(item, req, paths, callback) {
	
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

			if (/^(delete|reset)$/.test(action)){
				field.apply(item, action, callback);
				return;
			}
		}

		if (req.files && req.files[paths.upload] && req.files[paths.upload].size) {
			return field.uploadFile(item, req.files[paths.upload], true, callback);
		}

		return callback();

	};

};


/**
 * Immediately handles a standard form submission for the field (see `getRequestHandler()`)
 *
 * @api public
 */

file.prototype.handleRequest = function(item, req, paths, callback) {
	this.getRequestHandler(item, req, paths, callback)();
};


/*!
 * Export class
 */

exports = module.exports = file;
