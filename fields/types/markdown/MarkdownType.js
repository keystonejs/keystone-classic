var FieldType = require('../Type');
var marked = require('marked');
var util = require('util');
var validators = require('../validators');

/**
 * Markdown FieldType Constructor
 * @extends Field
 * @api public
 */

function markdown (list, path, options) {
	this._defaultSize = 'full';

	this.toolbarOptions = options.toolbarOptions || {};
	this.markedOptions = options.markedOptions || {};
	this.height = options.height || 90;
	this.wysiwyg = ('wysiwyg' in options) ? options.wysiwyg : true;

	this._properties = ['wysiwyg', 'height', 'toolbarOptions'];
	markdown.super_.call(this, list, path, options);
}
util.inherits(markdown, FieldType);

/* Use text validators */
markdown.prototype.validateInput = validators.text.input;
markdown.prototype.validateRequiredInput = validators.text.required;

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * Adds String properties for .md and .html markdown, and a setter for .md
 * that generates html when it is updated.
 *
 * @api public
 */
markdown.prototype.addToSchema = function () {

	var schema = this.list.schema;

	var paths = this.paths = {
		md: this._path.append('.md'),
		html: this._path.append('.html'),
	};

	var markedOptions = this.markedOptions;

	var setMarkdown = function (value) {
		if (value === this.get(paths.md)) {
			return value;
		}
		if (typeof value === 'string') {
			this.set(paths.html, marked(value, markedOptions));
			return value;
		} else {
			this.set(paths.html, undefined);
			return undefined;
		}
	};

	schema.nested[this.path] = true;
	schema.add({
		html: { type: String },
		md: { type: String, set: setMarkdown },
	}, this.path + '.');

	this.bindUnderscoreMethods();
};

/**
 * Formats the field value
 *
 * @api public
 */
markdown.prototype.format = function (item) {
	return item.get(this.paths.html);
};

/**
 * Validates that a value for this field has been provided in a data object
 *
 * Deprecated
 */
markdown.prototype.inputIsValid = function (data, required, item) {
	if (!(this.path in data) && item && item.get(this.paths.md)) {
		return true;
	}
	return (!required || data[this.path]) ? true : false;
};

/**
 * Detects whether the field has been modified
 *
 * @api public
 */
markdown.prototype.isModified = function (item) {
	return item.isModified(this.paths.md);
};

/**
 * Updates the value for this field in the item from a data object
 *
 * Will accept either the field path, or paths.md
 *
 * @api public
 */
markdown.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);
	if (value !== undefined) {
		item.set(this.paths.md, value);
	}	else if (this.paths.md in data) {
		item.set(this.paths.md, data[this.paths.md]);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = markdown;
