/*!
 * Module dependencies.
 */

var numeral = require('numeral'),
	utils = require('keystone-utils'),
	keystone = require('../../'),
	Field = keystone.Field;

module.exports = Field.extend({
	/**
	 * Number FieldType Constructor
	 * @extends Field
	 * @api public
	 */
	constructor: function(list, path, options) {
		this._nativeType = Number;
		this._underscoreMethods = ['format'];
		this._formatString = (options.format === false) ? false : (options.format || '0,0[.][000000000000]');
		if (this._formatString && 'string' != typeof this._formatString) {
			throw new Error('FieldType.Number: options.format must be a string.');
		}
		Field.apply(this, arguments);
	},

	/**
	 * Formats the field value
	 *
	 * @api public
	 */
	format: function(item, format) {
		if (format || this._formatString) {
			return ('number' == typeof item.get(this.path)) ? numeral(item.get(this.path)).format(format || this._formatString) : '';
		} else {
			return item.get(this.path) || '';
		}
	},

	/**
	 * Checks that a valid number has been provided in a data object
	 *
	 * An empty value clears the stored value and is considered valid
	 *
	 * @api public
	 */
	validateInput: function(data, required, item) {
		if (!(this.path in data) && item && (item.get(this.path) || item.get(this.path) === 0)) return true;

		if (data[this.path]) {
			var newValue = utils.number(data[this.path]);
			return (!isNaN(newValue));
		} else {
			return (required) ? false : true;
		}
	},

	/**
	 * Updates the value for this field in the item from a data object
	 *
	 * @api public
	 */
	updateItem: function(item, data) {
		if (!(this.path in data))
			return;

		var newValue = utils.number(data[this.path]);

		if (!isNaN(newValue)) {
			if (newValue != item.get(this.path)) {
				item.set(this.path, newValue);
			}
		} else if ('number' == typeof item.get(this.path)) {
			item.set(this.path, null);
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
		if (filter[0] == 'gt' || filter[0] == 'lt') {
			ops.operator = filter[0];
			filter.shift();
		}
		ops.value = filter[0];
	},

	getSearchFilters: function (filter, filters) {
		var val = utils.number(filter.value);
		if (!isNaN(val)) {
			if (filter.operator == 'gt') {
				filters[filter.field.path] = { $gt: val };
			} else if (filter.operator == 'lt') {
				filters[filter.field.path] = { $lt: val };
			} else {
				filters[filter.field.path] = val;
			}
		} else {
			filters[filter.field.path] = null;
		}
	}
});
