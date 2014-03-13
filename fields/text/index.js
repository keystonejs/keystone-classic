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
		this._underscoreMethods = ['crop'];

		Field.apply(this, arguments);
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
