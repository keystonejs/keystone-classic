/*!
 * Module dependencies.
 */

var utils = require('keystone-utils'),
  keystone = require('../../'),
  Field = keystone.Field;

module.exports = Field.extend({
	/**
	 * Boolean FieldType Constructor
	 * @extends Field
	 * @api public
	 */
	constructor: function(list, path, options) {
		this._nativeType = Boolean;
		this.indent = (options.indent) ? true : false;

		Field.apply(this, arguments);
	},

	/**
	 * Validates that a truthy value for this field has been provided in a data object.
	 *
	 * Useful for checkboxes that are required to be true (e.g. agreed to terms and cond's)
	 *
	 * @api public
	 */
	validateInput: function(data, required) {
		if (required) {
			return (data[this.path] === true || data[this.path] === 'true') ? true : false;
		} else {
			return true;
		}
	},

	/**
	 * Updates the value for this field in the item from a data object.
	 * Only updates the value if it has changed.
	 * Treats a true boolean or string == 'true' as true, everything else as false.
	 *
	 * @api public
	 */
	updateItem: function(item, data) {
		if (data[this.path] === true || data[this.path] === 'true') {
			if (!item.get(this.path))
				item.set(this.path, true);
		} else if (item.get(this.path)) {
			item.set(this.path, false);
		}
	},

  /**
   * Processes a filter array into a filters object
   *
   * @param {Object} ops
   * @param {Array} filter
   * @api private
   */

  processFilters: function (ops, filter) {
    ops.value = (filter[0] == 'true') ? true : false;
  }
});
