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

	file.super_.call(this, list, path, options);

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

}

/*!
 * Inherit from Field
 */

util.inherits(file, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */

file.prototype.addToSchema = function() {
	
	var field = this,
		schema = this.list.schema;
	
	var paths = this.paths = {
		// fields
		filename:		this._path.append('.filename'),
		originalname:	this._path.append('.originalname'),
		path:			this._path.append('.path'),
		size:			this._path.append('.size'),
		filetype:		this._path.append('.filetype'),
		// virtuals
		exists:			this._path.append('.exists'),
		href:			this._path.append('.href'),
		upload:			this._path.append('_upload'),
		action:			this._path.append('_action')
	};
	
	var schemaPaths = this._path.addTo({}, {
		filename:		String,
		originalname:	String,
		path:			String,
		size:			Number,
		filetype:		String
	});
	
	schema.add(schemaPaths);
	
	// exists checks for a matching file at run-time
	var exists = function(item) {
		var filepath = item.get(paths.path),
			filename = item.get(paths.filename);

		if (!filepath || !filename) {
			return false;
		}

		return fs.existsSync(path.join(filepath, filename));
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
		item.set(field.path, {
			filename: '',
			originalname: '',
			path: '',
			size: 0,
			filetype: ''
		});
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
		delete: function() {
			if (exists(this)) {
				field.deleteFile(item.get(field.path), callback);
			}
			reset(this);
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
 * Uploads a file
 *
 * @api public
 */

file.prototype.deleteFile = function() {
	this.store.deleteFile(data);
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

			if (/^(delete|reset)$/.test(action))
				field.apply(item, action);
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
