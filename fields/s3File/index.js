/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	moment = require('moment'),
	async = require('async'),
	knox = require('knox'),
	// s3 = require('s3'),
	utils = require('keystone-utils'),
  keystone = require('../../'),
  Field = keystone.Field;

module.exports = S3File = Field.extend({
	/**
	 * S3File FieldType Constructor
	 * @extends Field
	 * @api public
	 */
	constructor: function(list, path, options) {
		this._underscoreMethods = ['format', 'uploadFile'];

		// event queues
		this._pre = {
			upload: []
		};

		// TODO: implement filtering, usage disabled for now
		options.nofilter = true;

		// TODO: implement initial form, usage disabled for now
		if (options.initial) {
			throw new Error('Invalid Configuration\n\n' +
				'S3File fields (' + list.key + '.' + path + ') do not currently support being used as initial fields.\n');
		}

		Field.apply(this, arguments);

		// validate s3 config (has to happen after super_.call)
		if (!this.s3config) {
			throw new Error('Invalid Configuration\n\n' +
				'S3File fields (' + list.key + '.' + path + ') require the "s3 config" option to be set.\n\n' +
				'See http://keystonejs.com/docs/configuration#amazons3 for more information.\n');
		}

		// Could be more pre- hooks, just upload for now
		if (options.pre && options.pre.upload) {
			this._pre.upload = this._pre.upload.concat(options.pre.upload);
		}
	},

	/**
	 * Allows you to add pre middleware after the field has been initialised
	 *
	 * @api public
	 */
	pre: function(event, fn) {
		if (!this._pre[event]) {
			throw new Error('S3File (' + this.list.key + '.' + this.path + ') error: s3field.pre()\n\n' +
				'Event ' + event + ' is not supported.\n');
		}
		this._pre[event].push(fn);
		return this;
	},

	/**
	 * Registers the field on the List's Mongoose Schema.
	 *
	 * @api public
	 */
	addToSchema: function() {
		var field = this,
			schema = this.list.schema;

		var paths = this.paths = {
			// fields
			filename: this._path.append('.filename'),
			path: this._path.append('.path'),
			size: this._path.append('.size'),
			filetype: this._path.append('.filetype'),
			url: this._path.append('.url'),
			// virtuals
			exists: this._path.append('.exists'),
			upload: this._path.append('_upload'),
			action: this._path.append('_action')
		};

		var schemaPaths = this._path.addTo({}, {
			filename: String,
			path: String,
			size: Number,
			filetype: String,
			url: String
		});

		schema.add(schemaPaths);

		var exists = function(item) {
			return (item.get(paths.url) ? true : false);
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
				filetype: '',
				url: ''
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
			 * Deletes the file from S3File and resets the field
			 *
			 * @api public
			 */
			delete: function() {
				try {
					var client = knox.createClient(field.s3config);
					client.deleteFile(this.get(paths.path) + this.get(paths.filename), function(err, res) {
						res ? res.resume() : false;
					});
				} catch (e) {}
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
	},

	/**
	 * Formats the field value
	 *
	 * @api public
	 */
	format: function(item) {
		return item.get(this.paths.url);
	},

	/**
	 * Detects whether the field has been modified
	 *
	 * @api public
	 */
	isModified: function(item) {
		return item.isModified(this.paths.url);
	},

	/**
	 * Validates that a value for this field has been provided in a data object
	 *
	 * @api public
	 */
	validateInput: function(data) {
		// TODO - how should file field input be validated?
		return true;
	},

	/**
	 * Updates the value for this field in the item from a data object
	 *
	 * @api public
	 */
	updateItem: function(item, data) {
		// TODO - direct updating of data (not via upload)
	},

	/**
	 * Uploads the file for this field
	 *
	 * @api public
	 */
	uploadFile: function(item, file, update, callback) {
		var field = this,
			path = field.options.s3path ? field.options.s3path + '/' : '',
			prefix = field.options.datePrefix ? moment().format(field.options.datePrefix) + '-' : '',
			name = prefix + file.name;

		if (field.options.allowedTypes && !_.contains(field.options.allowedTypes, file.type)) {
			return callback(new Error('Unsupported File Type: ' + file.type));
		}

		if ('function' == typeof update) {
			callback = update;
			update = false;
		}

		var doUpload = function() {

			knox.createClient(field.s3config).putFile(file.path, path + name, {
				'Content-Type': file.type,
				'x-amz-acl': 'public-read'
			}, function(err, res) {

				if (res) res.resume();
				if (err) return callback(err);

				var fileData = {
					filename: name,
					path: path,
					size: file.size,
					filetype: file.type,
					url: res.req.url
				};

				if (update) {
					item.set(field.path, fileData);
				}

				callback(null, fileData);

			});

		};

		async.eachSeries(this._pre.upload, function(fn, next) {
			fn(item, file, next);
		}, function(err) {
			if (err) return callback(err);
			doUpload();
		});

		// Alternative method via S3 module, which provides helpful events for uploading files, leaving for future reference
		/*
		var client = s3.createClient(keystone.get('s3 config'));

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

	},


	/**
	 * Returns a callback that handles a standard form submission for the field
	 *
	 * Expected form parts are
	 * - `field.paths.action` in `req.body` (`clear` or `delete`)
	 * - `field.paths.upload` in `req.files` (uploads the file to s3file)
	 *
	 * @api public
	 */
	getRequestHandler: function(item, req, paths, callback) {
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
	},

	/**
	 * Immediately handles a standard form submission for the field (see `getRequestHandler()`)
	 *
	 * @api public
	 */
	handleRequest: function(item, req, paths, callback) {
		this.getRequestHandler(item, req, paths, callback)();
	},

  /**
   * Processes a filter array into a filters object
   *
   * @param {Object} ops
   * @param {Array} filter
   * @api private
   */

  processFilters: function (ops, filter) {
    ops.value = (filter[0] == 'true') ? true : false;
  }
});


/**
 * Exposes the custom or keystone s3 config settings
 */
Object.defineProperty(S3File.prototype, 's3config', {
	get: function() {
		return this.options.s3config || keystone.get('s3 config');
	}
});
