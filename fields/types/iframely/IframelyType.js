var keystone = require('../../../');
var util = require('util');
var http = require('http');
var FieldType = require('../Type');

/**
 * Iframely FieldType Constructor
 *
 * Reqires the option `from` to refer to another path in the schema
 * that provides the url to expand
 *
 * @extends Field
 * @api public
 */
function iframely (list, path, options) {

	this._underscoreMethods = ['reset'];
	this._fixedSize = 'full';
	this.fromPath = options.from;
	this.iframelyOptions = options.options || {};

	// Check the api key has been set, or bail.
	if (!keystone.get('iframely api key')) {
		throw new Error('Invalid Configuration\n\n'
			+ 'Iframely fields (' + list.key + '.' + path + ') require the "iframely api key" option to be set.\n\n'
			+ 'See http://keystonejs.com/docs/configuration/#services-iframely for more information.\n');
	}

	// Ensure a fromPath has been defined
	if (!options.from) {
		throw new Error('Invalid Configuration\n\n'
			+ 'Iframely fields (' + list.key + '.' + path + ') require a fromPath option to be set.\n'
			+ 'See http://keystonejs.com/docs/database/#fieldtypes-iframely for more information.\n');
	}

	// iframely fields cannot be set as initial fields
	if (options.initial) {
		throw new Error('Invalid Configuration\n\n'
			+ 'Iframely fields (' + list.key + '.' + path + ') cannot be set as initial fields.\n');
	}

	iframely.super_.call(this, list, path, options);
}
iframely.properName = 'Iframely';
util.inherits(iframely, FieldType);

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */
iframely.prototype.addToSchema = function (schema) {

	var field = this;

	this.paths = {
		exists: this.path + '.exists',
		type: this.path + '.type',
		title: this.path + '.title',
		url: this.path + '.url',
		width: this.path + '.width',
		height: this.path + '.height',
		version: this.path + '.version',
		description: this.path + '.description',
		html: this.path + '.html',
		authorName: this.path + '.authorName',
		authorUrl: this.path + '.authorUrl',
		providerName: this.path + '.providerName',
		thumbnailUrl: this.path + '.thumbnailUrl',
		thumbnailWidth: this.path + '.thumbnailWidth',
		thumbnailHeight: this.path + '.thumbnailHeight',
	};

	schema.nested[this.path] = true;
	schema.add({
		exists: Boolean,
		type: String,
		title: String,
		url: String,
		width: Number,
		height: Number,
		version: String,
		description: String,
		html: String,
		authorName: String,
		authorUrl: String,
		providerName: String,
		thumbnailUrl: String,
		thumbnailWidth: Number,
		thumbnailHeight: Number,
	}, this.path + '.');

	// Bind the pre-save hook to hit the iframely api if the source path has changed

	schema.pre('save', function (next) {

		if (!this.isModified(field.fromPath)) {
			return next();
		}

		var fromValue = this.get(field.fromPath);

		if (!fromValue) {
			field.reset(this);
			return next();
		}

		var post = this;

		const IFRAMELY_API_KEY = keystone.get('iframely api key');
		const URL = `http://iframe.ly/api/oembed?url=${fromValue}&api_key=${IFRAMELY_API_KEY}`;

		http.get(URL, res => {
			res.setEncoding('utf8');
			let body = '';
			res.on('error', err => {
				console.error('Iframely API Error:');
				console.error(err);
				field.reset(post);
				return next();
			});
			res.on('data', data => (body += data));
			res.on('end', () => {
				try {
					body = JSON.parse(body);
				} catch (e) {
					console.error(e);
					field.reset(post);
				}

				if (body.error) {
					field.reset(post);
				} else {
					post.set(field.path, {
						exists: true,
						type: body.type,
						title: body.title,
						url: body.url,
						width: body.width,
						height: body.height,
						version: body.version,
						description: body.description,
						html: body.html,
						authorName: body.author,
						authorUrl: body.author_url,
						providerName: body.provider_name,
						thumbnailUrl: body.thumbnail_url,
						thumbnailWidth: body.thumbnail_width,
						thumbnailHeight: body.thumbnail_height,
					});
				}
				return next();
			});
		});
	});

	this.bindUnderscoreMethods();
};

/**
 * Resets the value of the field
 *
 * @api public
 */
iframely.prototype.reset = function (item) {
	return item.set(item.set(this.path, {
		exists: false,
		type: null,
		title: null,
		url: null,
		width: null,
		height: null,
		version: null,
		description: null,
		html: null,
		authorName: null,
		authorUrl: null,
		providerName: null,
		thumbnailUrl: null,
		thumbnailWidth: null,
		thumbnailHeight: null,
	}));
};

/**
 * Formats the field value
 *
 * @api public
 */
iframely.prototype.format = function (item) {
	return item.get(this.paths.html);
};

/**
 * Gets the field's data from an Item, as used by the React components
 */
iframely.prototype.getData = function (item) {
	var value = item.get(this.path);
	return typeof value === 'object' ? value : {};
};

/**
 * Detects whether the field has been modified
 *
 * @api public
 */
iframely.prototype.isModified = function (item) {
	// Assume that it has changed if the url is different
	return item.isModified(this.paths.url);
};

/**
 * Field has no input and is always valid
 *
 * Deprecated
 */
iframely.prototype.inputIsValid = function () {
	return true;
};

/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */
iframely.prototype.updateItem = function (item, data, callback) {
	// TODO: This could be more granular and check for actual changes to values,
	// see the Location field for an example

 // This field type is never editable, so to ensure that we don't inadvertently reset the fields on this item with a null value
 // A conditional has been added to negate updating this item should the fromPath on the passed in data object be the same as that on the item.
	if (data[this.fromPath] !== item[this.fromPath]) {
		item.set(item.set(this.path, {
			exists: data[this.paths.exists],
			type: data[this.paths.type],
			title: data[this.paths.title],
			url: data[this.paths.url],
			width: data[this.paths.width],
			height: data[this.paths.height],
			version: data[this.paths.version],
			description: data[this.paths.description],
			html: data[this.paths.html],
			authorName: data[this.paths.authorName],
			authorUrl: data[this.paths.authorUrl],
			providerName: data[this.paths.providerName],
			thumbnailUrl: data[this.paths.thumbnailUrl],
			thumbnailWidth: data[this.paths.thumbnailWidth],
			thumbnailHeight: data[this.paths.thumbnailHeight],
		}));
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = iframely;
