/*!
 * Module dependencies.
 */

var utils = require('keystone-utils'),
	keystone = require('../../'),
	Field = keystone.Field;

module.exports = Field.extend({
	/**
	 * HTML FieldType Constructor
	 * @extends Field
	 * @api public
	 */
	constructor: function(list, path, options) {
		this._nativeType = String;

		// TODO: implement filtering, usage disabled for now
		options.nofilter = true;

		this.wysiwyg = (options.wysiwyg) ? true : false;
		this.height = options.height || 180;

		Field.apply(this, arguments);
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
