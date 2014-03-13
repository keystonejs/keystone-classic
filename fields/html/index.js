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
	}
});
