/*!
 * Module dependencies.
 */

var fs = require('fs'),
	path = require('path'),
	_ = require('underscore'),
	moment = require('moment'),
	async = require('async'),
	util = require('util'),
	utils = require('keystone-utils'),
	super_ = require('../field');

/**
 * localfile FieldType Constructor
 * @extends Field
 * @api public
 */

function localfile(list, path, options) {
	this._underscoreMethods = ['format', 'uploadFile'];

	// event queues
	this._pre = {
		move: [] // Before file is moved into final destination
	};

	this._post = {
		move: [] // After file is moved into final destination
	};

	// TODO: implement filtering, usage disabled for now
	options.nofilter = true;

	// TODO: implement initial form, usage disabled for now
	if (options.initial) {
		throw new Error('Invalid Configuration\n\n' +
			'localfile fields (' + list.key + '.' + path + ') do not currently support being used as initial fields.\n');
	}

	localfile.super_.call(this, list, path, options);

	// validate destination dir
	if (!options.dest) {
		throw new Error('Invalid Configuration\n\n' +
			'localfile fields (' + list.key + '.' + path + ') require the "dest" option to be set.');
	}

	// Allow hook into before and after
	if (options.pre && options.pre.move) {
		this._pre.move = this._pre.move.concat(options.pre.move);
	}

	if (options.post && options.post.move) {
		this._post.move = this._post.move.concat(options.post.move);
	}
}

/*!
 * Inherit from Field
 */

util.inherits(localfile, super_);


/**
 * Allows you to add pre middleware after the field has been initialised
 *
 * @api public
 */

localfile.prototype.pre = function(event, fn) {
	if (!this._pre[event]) {
		throw new Error('localfile (' + this.list.key + '.' + this.path + ') error: localfile.pre()\n\n' +
			'Event ' + event + ' is not supported.\n');
	}
	this._pre[event].push(fn);
	return this;
};


/**
 * Allows you to add post middleware after the field has been initialised
 *
 * @api public
 */

localfile.prototype.post = function(event, fn) {
	if (!this._post[event]) {
		throw new Error('localfile (' + this.list.key + '.' + this.path + ') error: localfile.post()\n\n' +
			'Event ' + event + ' is not supported.\n');
	}
	this._post[event].push(fn);
	return this;
};


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
		path:			this._path.append('.path'),
		size:			this._path.append('.size'),
		filetype:		this._path.append('.filetype'),
		// virtuals
		exists:			this._path.append('.exists'),
		upload:			this._path.append('_upload'),
		action:			this._path.append('_action')
	};

	var schemaPaths = this._path.addTo({}, {
		filename:		String,
		path:			String,
		size:			Number,
		filetype:		String
	});

	schema.add(schemaPaths);

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
	if (this.hasFormatter()) {
		return this.options.format(item, item[this.path]);
	}
	return this.href(item);
};


/**
 * Detects the field have formatter function
 *
 * @api public
 */

localfile.prototype.hasFormatter = function() {
	return 'function' === typeof this.options.format;
};


/**
 * Return objects href
 *
 * @api public
 */

localfile.prototype.href = function(item) {
	if (this.options.prefix) {
		return this.options.prefix + '/' + item.get(this.paths.filename);
	}
	return path.join(item.get(this.paths.path), item.get(this.paths.filename));
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

localfile.prototype.validateInput = function(data) {
	// TODO - how should file field input be validated?
	return true;
};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

localfile.prototype.updateItem = function(item, data) {
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
		name = prefix + file.name;

	if (field.options.allowedTypes && !_.contains(field.options.allowedTypes, file.type)){
		return callback(new Error('Unsupported File Type: '+file.type));
	}

	if ('function' === typeof update) {
		callback = update;
		update = false;
	}

	var doMove = function(callback) {
		
		if ('function' === typeof field.options.filename) {
			name = field.options.filename(item, name);
		}

		fs.rename(file.path, path.join(field.options.dest, name), function(err) {
			
			if (err) return callback(err);

			var fileData = {
				filename: name,
				path: field.options.dest,
				size: file.size,
				filetype: file.type
			};

			if (update) {
				item.set(field.path, fileData);
			}

			callback(null, fileData);
			
		});
	};

	async.eachSeries(this._pre.move, function(fn, next) {
		fn(item, file, next);
	}, function(err) {
		
		if (err) return callback(err);

		doMove(function(err, fileData) {
			if (err) return callback(err);

			async.eachSeries(field._post.move, function(fn, next) {
				fn(item, file, fileData, next);
			}, function(err) {
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
