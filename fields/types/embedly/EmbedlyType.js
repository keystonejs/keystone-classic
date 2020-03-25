var _ = require("lodash");
var keystone = require("../../../");
var util = require("util");
var EmbedlyAPI = require("embedly");
var FieldType = require("../Type");

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
	this._underscoreMethods = ["reset"];
	this._fixedSize = "full";
	this.fromPath = options.from;
	this.embedlyOptions = options.options || {};

	// check and api key has been set, or bail.
	if (!keystone.get("embedly api key")) {
		throw new Error(
			"Invalid Configuration\n\n" +
				"Embedly fields (" +
				list.key +
				"." +
				path +
				') require the "embedly api key" option to be set.\n\n' +
				"See http://v4.keystonejs.com/docs/configuration/#services-embedly for more information.\n"
		);
	}

	// ensure a fromPath has been defined
	if (!options.from) {
		throw new Error(
			"Invalid Configuration\n\n" +
				"Embedly fields (" +
				list.key +
				"." +
				path +
				") require a fromPath option to be set.\n" +
				"See http://v4.keystonejs.com/docs/database/#fieldtypes-embedly for more information.\n"
		);
	}

	// embedly fields cannot be set as initial fields
	if (options.initial) {
		throw new Error(
			"Invalid Configuration\n\n" +
				"Embedly fields (" +
				list.key +
				"." +
				path +
				") cannot be set as initial fields.\n"
		);
	}

	embedly.super_.call(this, list, path, options);
}
embedly.properName = "Embedly";
util.inherits(embedly, FieldType);

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */
embedly.prototype.addToSchema = function(schema) {
	var field = this;

	this.paths = {
		exists: this.path + ".exists",
		type: this.path + ".type",
		title: this.path + ".title",
		url: this.path + ".url",
		width: this.path + ".width",
		height: this.path + ".height",
		version: this.path + ".version",
		description: this.path + ".description",
		html: this.path + ".html",
		authorName: this.path + ".authorName",
		authorUrl: this.path + ".authorUrl",
		providerName: this.path + ".providerName",
		providerUrl: this.path + ".providerUrl",
		thumbnailUrl: this.path + ".thumbnailUrl",
		thumbnailWidth: this.path + ".thumbnailWidth",
		thumbnailHeight: this.path + ".thumbnailHeight"
	};

	schema.nested[this.path] = true;
	schema.add(
		{
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
			providerUrl: String,
			thumbnailUrl: String,
			thumbnailWidth: Number,
			thumbnailHeight: Number
		},
		this.path + "."
	);

	// Bind the pre-save hook to hit the embedly api if the source path has changed

	schema.pre("save", function(next) {
		if (!this.isModified(field.fromPath)) {
			return next();
		}

		var fromValue = this.get(field.fromPath);

		if (!fromValue) {
			field.reset(this);
			return next();
		}

		var post = this;

		var api = new EmbedlyAPI({ key: keystone.get("embedly api key") });
		var opts = _.defaults({ url: fromValue }, field.embedlyOptions);

		api.oembed(opts, function(err, objs) {
			if (err) {
				console.error("Embedly API Error:");
				console.error(err, objs);
				field.reset(post);
			} else {
				var data = objs[0];
				if (data && data.type !== "error") {
					post.set(field.path, {
						exists: true,
						type: data.type,
						title: data.title,
						url: data.url,
						width: data.width,
						height: data.height,
						version: data.version,
						description: data.description,
						html: data.html,
						authorName: data.author_name,
						authorUrl: data.author_url,
						providerName: data.provider_name,
						providerUrl: data.provider_url,
						thumbnailUrl: data.thumbnail_url,
						thumbnailWidth: data.thumbnail_width,
						thumbnailHeight: data.thumbnail_height
					});
				} else {
					field.reset(post);
				}
			}
			return next();
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
	return item.set(
		item.set(this.path, {
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
			providerUrl: null,
			thumbnailUrl: null,
			thumbnailWidth: null,
			thumbnailHeight: null
		})
	);
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
 * Gets the field's data from an Item, as used by the React components
 */
embedly.prototype.getData = function(item) {
	var value = item.get(this.path);
	return typeof value === "object" ? value : {};
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
 * Field has no input and is always valid
 *
 * Deprecated
 */
embedly.prototype.inputIsValid = function() {
	return true;
};

/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */
embedly.prototype.updateItem = function(item, data, callback) {
	// TODO: This could be more granular and check for actual changes to values,
	// see the Location field for an example

	// This field type is never editable, so to ensure that we don't inadvertently reset the fields on this item with a null value
	// A conditional has been added to negate updating this item should the fromPath on the passed in data object be the same as that on the item.
	if (data[this.fromPath] !== item[this.fromPath]) {
		item.set(
			item.set(this.path, {
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
				providerUrl: data[this.paths.providerUrl],
				thumbnailUrl: data[this.paths.thumbnailUrl],
				thumbnailWidth: data[this.paths.thumbnailWidth],
				thumbnailHeight: data[this.paths.thumbnailHeight]
			})
		);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = embedly;
