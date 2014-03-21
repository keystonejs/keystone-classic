/*!
 * Module dependencies.
 */

var utils = require('keystone-utils'),
	keystone = require('../../'),
	Field = keystone.Field;

module.exports = Field.extend({
	/**
	 * Text FieldType Constructor
	 * @extends Field
	 * @api public
	 */
	constructor: function(list, path, options) {
		this._nativeType = String;
		this._underscoreMethods = ['format', 'crop'];
		this.height = options.height || 90;
		FieldBase.apply(this, arguments);
	},

	/**
	 * Formats the field value
	 *
	 * @api public
	 */
	format: function(item) {
		return utils.textToHTML(item.get(this.path));
	},

	/**
	 * Crops the string to the specifed length.
	 *
	 * @api public
	 */
	crop: function(item, length, append, preserveWords) {
		return utils.cropString(item.get(this.path), length, append, preserveWords);
	},

	getSearchFilters: function (filter, filters) {
		if (filter.exact) {
			if (filter.value) {
				var cond = new RegExp('^' + utils.escapeRegExp(filter.value) + '$', 'i');
				filters[filter.field.path] = filter.inv ? { $not: cond } : cond;
			} else {
				if (filter.inv) {
					filters[filter.field.path] = { $nin: ['', null] };
				} else {
					filters[filter.field.path] = { $in: ['', null] };
				}
			}
		} else if (filter.value) {
			var cond = new RegExp(utils.escapeRegExp(filter.value), 'i');
			filters[filter.field.path] = filter.inv ? { $not: cond } : cond;
		}
	}
});
