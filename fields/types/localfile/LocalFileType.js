/*!
 * Module dependencies.
 */

var fs = require('fs-extra'),
	path = require('path'),
	_ = require('underscore'),
	moment = require('moment'),
	grappling = require('grappling-hook'),
	util = require('util'),
	utils = require('keystone-utils'),
	super_ = require('../Type');

/**
 * localfile FieldType Constructor
 * @extends Field
 * @api public
 */

function localfile(list, path, options) {
	grappling.mixin(this)
		.allowHooks('move');
	this._underscoreMethods = ['format', 'uploadFile'];
	this._fixedSize = 'full';

	// TODO: implement filtering, usage disabled for now
	options.nofilter = true;
	
	// TODO: implement initial form, usage disabled for now
	if (options.initial) {
		throw new Error('Invalid Configuration\n\n' +
			'localfile fields (' + list.key + '.' + path + ') do not currently support being used as initial fields.\n');
	}
	
	if (options.overwrite !== false) {
		options.overwrite = true;
	}
	
	localfile.super_.call(this, list, path, options);
	
	// validate destination dir
	if (!options.dest) {
		throw new Error('Invalid Configuration\n\n' +
			'localfile fields (' + list.key + '.' + path + ') require the "dest" option to be set.');
	}
	// Allow hook into before and after
	if (options.pre && options.pre.move) {
		this.pre('move', options.pre.move);
	}
	
	if (options.post && options.post.move) {
		this.post('move', options.post.move);
	}
	
}

/*!
 * Inherit from Field
 */

util.inherits(localfile, super_);



/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */

localfile.prototype.addToSchema = function() {
	
	var field = this,
		schema = this.list.schema;
	
	var paths = this.paths = {
		// fields
		filename:		this._path.append('.filename'),
		originalname:		this._path.append('.originalname'),
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
		originalname:   String,
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
		 * Deletes the file from localfile and resets the field
		 *
		 * @api public
		 */
		delete: function() {
			if (exists(this)) {
				fs.unlinkSync(path.join(this.get(paths.path), this.get(paths.filename)));
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

localfile.prototype.format = function(item) {
	if (!item.get(this.paths.filename)) return '';
	if (this.hasFormatter()) {
		var file = item.get(this.path);
		file.href = this.href(item);
		return this.options.format.call(this, item, file);
	}
	return this.href(item);
};


/**
 * Detects whether the field has formatter function
 *
 * @api public
 */

localfile.prototype.hasFormatter = function() {
	return 'function' === typeof this.options.format;
};


/**
 * Return the public href for the stored file
 *
 * @api public
 */

localfile.prototype.href = function(item) {
	if (!item.get(this.paths.filename)) return '';
	var prefix = this.options.prefix ? this.options.prefix : item.get(this.paths.path);
	return prefix + '/' + item.get(this.paths.filename);
};


/**
 * Detects whether the field has been modified
 *
 * @api public
 */

localfile.prototype.isModified = function(item) {
	return item.isModified(this.paths.path);
};


/**
 * Validates that a value for this field has been provided in a data object
 *
 * @api public
 */

localfile.prototype.validateInput = function(data) {//eslint-disable-line no-unused-vars
	// TODO - how should file field input be validated?
	return true;
};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

localfile.prototype.updateItem = function(item, data) {//eslint-disable-line no-unused-vars
	// TODO - direct updating of data (not via upload)
};


/**
 * Uploads the file for this field
 *
 * @api public
 */

localfile.prototype.uploadFile = function(item, file, update, callback) {
	var field = this,
		prefix = field.options.datePrefix ? moment().format(field.options.datePrefix) + '-' : '',
		filename = prefix + file.name,
		filetype = file.mimetype || file.type;

	if (field.options.allowedTypes && !_.contains(field.options.allowedTypes, filetype)) {
		return callback(new Error('Unsupported File Type: ' + filetype));
	}

	if ('function' === typeof update) {
		callback = update;
		update = false;
	}

	var doMove = function(callback) {
		
		if ('function' === typeof field.options.filename) {
			filename = field.options.filename(item, file);
		}

		fs.move(file.path, path.join(field.options.dest, filename), { clobber: field.options.overwrite }, function(err) {
			
			if (err) return callback(err);

			var fileData = {
				filename: filename,
				originalname: file.originalname,
				path: field.options.dest,
				size: file.size,
				filetype: filetype
			};

			if (update) {
				item.set(field.path, fileData);
			}

			callback(null, fileData);
			
		});
	};

	field.callHook('pre:move', item, file, function(err) {
		if (err) return callback(err);
		doMove(function(err, fileData) {
			if (err) return callback(err);
			field.callHook('post:move', [item, file, fileData], function(err) {
				if (err) return callback(err);
				callback(null, fileData);
			});
		});
	});
};


/**
 * Returns a callback that handles a standard form submission for the field
 *
 * Expected form parts are
 * - `field.paths.action` in `req.body` (`clear` or `delete`)
 * - `field.paths.upload` in `req.files` (uploads the file to localfile)
 *
 * @api public
 */

localfile.prototype.getRequestHandler = function(item, req, paths, callback) {

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

			if (/^(delete|reset)$/.test(action)) {
				field.apply(item, action);
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

localfile.prototype.handleRequest = function(item, req, paths, callback) {
	this.getRequestHandler(item, req, paths, callback)();
};


/*!
 * Export class
 */

exports = module.exports = localfile;
