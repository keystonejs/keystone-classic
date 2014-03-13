/*!
 * Module dependencies.
 */

var numeral = require('numeral'),
	utils = require('keystone-utils'),
  keystone = require('../../'),
  Field = keystone.Field;

module.exports = Field.extend({
	/**
	 * URL FieldType Constructor
	 * @extends Field
	 * @api public
	 */
	constructor: function(list, path, options) {
		this._nativeType = String;
		this._underscoreMethods = ['format'];
		FieldBase.apply(this, arguments);
	},

	/**
	 * Formats the field value
	 *
	 * Strips the leading protocol from the value for simpler display
	 *
	 * @api public
	 */
	format: function(item, format) {
		return (item.get(this.path) || '').replace(/^[a-zA-Z]\:\/\//, '');
	}
	// TODO: Proper url validation

});
