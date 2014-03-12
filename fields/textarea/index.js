/*!
 * Module dependencies.
 */

var utils = require('keystone-utils');

module.exports = function(FieldBase, keystone) {
	return FieldBase.extend({
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
		}
	});
};
