/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	keystone = require('../../'),
	util = require('util'),
	EmbedlyAPI = require('embedly'),
	super_ = require('../field');

/**
 * Embedly FieldType Constructor
 *
 * Reqires the option `from` to refer to another path in the schema
 * that provides the url to expand
 *
 * @extends Field
 * @api public
 */

function embedly(list, path, options) {

	this._underscoreMethods = ['reset'];
	this.fromPath = options.from;
	this.embedlyOptions = options.options || {};

	// TODO: implement filtering, usage disabled for now
	options.nofilter = true;

	// check and api key has been set, or bail.
	if (!keystone.get('embedly api key')) {
		throw new Error('Invalid Configuration\n\n' +
			'Embedly fields (' + list.key + '.' + this.path + ') require the "embedly api key" option to be set.\n\n' +
			'See http://keystonejs.com/docs/configuration/#embedly for more information.\n');
	}

	// ensure a fromPath has been defined
	if (!options.from) {
		throw new Error('Invalid Configuration\n\n' +
			'Embedly fields (' + list.key + '.' + path + ') require a fromPath option to be set.\n' +
			'See http://keystonejs.com/docs/database/#field_embedly for more information.\n');
	}

	// embedly fields cannot be set as initial fields
	if (options.initial) {
		throw new Error('Invalid Configuration\n\n' +
			'Embedly fields (' + list.key + '.' + path + ') cannot be set as initial fields.\n');
	}

	embedly.super_.call(this, list, path, options);

}

/*!
 * Inherit from Field
 */

util.inherits(embedly, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */

embedly.prototype.addToSchema = function() {

	var field = this,
		schema = this.list.schema;

	this.paths = {
		exists: 				this._path.append('.exists'),
		type: 					this._path.append('.type'),
		title: 					this._path.append('.title'),
		url: 					this._path.append('.url'),
		width: 					this._path.append('.width'),
		height: 				this._path.append('.height'),
		version: 				this._path.append('.version'),
		description: 			this._path.append('.description'),
		html: 					this._path.append('.html'),
		authorName: 			this._path.append('.authorName'),
		authorUrl: 				this._path.append('.authorUrl'),
		providerName: 			this._path.append('.providerName'),
		providerUrl: 			this._path.append('.providerUrl'),
		thumbnailUrl: 			this._path.append('.thumbnailUrl'),
		thumbnailWidth: 		this._path.append('.thumbnailWidth'),
		thumbnailHeight: 		this._path.append('.thumbnailHeight')
	};

	schema.nested[this.path] = true;
	schema.add({
		exists: 				Boolean,
		type: 					String,
		title: 					String,
		url: 					String,
		width: 					Number,
		height: 				Number,
		version: 				String,
		description: 			String,
		html: 					String,
		authorName: 			String,
		authorUrl: 				String,
		providerName: 			String,
		providerUrl: 			String,
		thumbnailUrl: 			String,
		thumbnailWidth: 		Number,
		thumbnailHeight: 		Number
	}, this.path + '.');

	// Bind the pre-save hook to hit the embedly api if the source path has changed

	schema.pre('save', function(next) {

		if (!this.isModified(field.fromPath)) {
			return next();
		}

		var fromValue = this.get(field.fromPath);

		if (!fromValue) {
			field.reset(this);
			return next();
		}

		var post = this;

		new EmbedlyAPI({ key: keystone.get('embedly api key') }, function(err, api) {

			if (err) {
				console.error('Error creating Embedly api:');
				console.error(err, api);
				field.reset(this);
				return next();
			}

			var opts = _.defaults({ url: fromValue }, field.embedlyOptions);

			api.oembed(opts, function(err, objs) {

				if (err) {
					console.error('Embedly API Error:');
					console.error(err, objs);
					field.reset(post);
				} else {
					var data = objs[0];
					if (data && data.type !== 'error') {
						post.set(field.path, {
							exists: 			true,
							type: 				data.type,
							title: 				data.title,
							url: 				data.url,
							width: 				data.width,
							height: 			data.height,
							version: 			data.version,
							description: 		data.description,
							html: 				data.html,
							authorName: 		data.author_name,
							authorUrl: 			data.author_url,
							providerName: 		data.provider_name,
							providerUrl: 		data.provider_url,
							thumbnailUrl: 		data.thumbnail_url,
							thumbnailWidth: 	data.thumbnail_width,
							thumbnailHeight: 	data.thumbnail_height
						});

					} else {
						field.reset(post);
					}
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

embedly.prototype.reset = function(item) {
	return item.set(item.set(this.path, {
		exists: 			false,
		type: 				null,
		title: 				null,
		url: 				null,
		width: 				null,
		height: 			null,
		version: 			null,
		description: 		null,
		html: 				null,
		authorName: 		null,
		authorUrl: 			null,
		providerName: 		null,
		providerUrl: 		null,
		thumbnailUrl: 		null,
		thumbnailWidth: 	null,
		thumbnailHeight: 	null
	}));
};


/**
 * Formats the field value
 *
 * @api public
 */

embedly.prototype.format = function(item) {
	return item.get(this.paths.html);
};


/**
 * Detects whether the field has been modified
 *
 * @api public
 */

embedly.prototype.isModified = function(item) {
	// Assume that it has changed if the url is different
	return item.isModified(this.paths.url);
};


/**
 * Validates that a value for this field has been provided in a data object
 *
 * @api public
 */

embedly.prototype.validateInput = function(data) {
	// TODO: I don't think embedly fields need to be validated...
	return true;
};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

embedly.prototype.updateItem = function(item, data) {
	// TODO: This could be more granular and check for actual changes to values,
	// see the Location field for an example
	return item.set(item.set(this.path, {
		exists: 			data[this.paths.exists],
		type: 				data[this.paths.type],
		title: 				data[this.paths.title],
		url: 				data[this.paths.url],
		width: 				data[this.paths.width],
		height: 			data[this.paths.height],
		version: 			data[this.paths.version],
		description: 		data[this.paths.description],
		html: 				data[this.paths.html],
		authorName: 		data[this.paths.authorName],
		authorUrl: 			data[this.paths.authorUrl],
		providerName: 		data[this.paths.providerName],
		providerUrl: 		data[this.paths.providerUrl],
		thumbnailUrl: 		data[this.paths.thumbnailUrl],
		thumbnailWidth: 	data[this.paths.thumbnailWidth],
		thumbnailHeight: 	data[this.paths.thumbnailHeight]
	}));
};


/*!
 * Export class
 */

exports = module.exports = embedly;
