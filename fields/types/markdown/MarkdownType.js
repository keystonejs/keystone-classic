/*!
 * Module dependencies.
 */

var util = require('util'),
	marked = require('marked'),
	super_ = require('../Type');

/**
 * Markdown FieldType Constructor
 * @extends Field
 * @api public
 */

function markdown(list, path, options) {
	
	this._defaultSize = 'full';
	
	// TODO: implement filtering, usage disabled for now
	options.nofilter = true;

	this.toolbarOptions = options.toolbarOptions || {};
	this.height = options.height || 90;

	// since wysiwyg option can be falsey this needs to use `in` instead of ||
	this.wysiwyg = ('wysiwyg' in options) ? options.wysiwyg : true;

	this._properties = ['wysiwyg', 'height', 'toolbarOptions'];

	markdown.super_.call(this, list, path, options);

}

/*!
 * Inherit from Field
 */

util.inherits(markdown, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 *
 * Adds String properties for .markdown and .html markdown, and a setter
 * for .markdown that generates html when it is updated.
 *
 * @api public
 */

markdown.prototype.addToSchema = function() {

	var schema = this.list.schema;

	var paths = this.paths = {
		md: this._path.append('.md'),
		html: this._path.append('.html')
	};

	var setMarkdown = function(value) {

		if (value === this.get(paths.md)) {
			return value;
		}

		if (typeof value === 'string') {
			this.set(paths.html, marked(value));
			return value;
		} else {
			this.set(paths.html, undefined);
			return undefined;
		}

	};

	schema.nested[this.path] = true;
	schema.add({
		html: { type: String },
		md: { type: String, set: setMarkdown }
	}, this.path + '.');

	this.bindUnderscoreMethods();
};


/**
 * Formats the field value
 *
 * @api public
 */

markdown.prototype.format = function(item) {
	return item.get(this.paths.html);
};


/**
 * Validates that a value for this field has been provided in a data object
 *
 * Will accept either the field path, or paths.md
 *
 * @api public
 */

markdown.prototype.validateInput = function(data, required, item) {
	if (!(this.path in data || this.paths.md in data) && item && item.get(this.paths.md)) {
		return true;
	}
	return (!required || data[this.path] || data[this.paths.md]) ? true : false;
};


/**
 * Detects whether the field has been modified
 *
 * @api public
 */

markdown.prototype.isModified = function(item) {
	return item.isModified(this.paths.md);
};


/**
 * Updates the value for this field in the item from a data object
 *
 * Will accept either the field path, or paths.md
 *
 * @api public
 */

markdown.prototype.updateItem = function(item, data) {
	var value = this.getValueFromData(data);
	if (value !== undefined) {
		item.set(this.paths.md, value);
	} else if (this.paths.md in data) {
		item.set(this.paths.md, data[this.paths.md]);
	}
};


/*!
 * Export class
 */

exports = module.exports = markdown;
