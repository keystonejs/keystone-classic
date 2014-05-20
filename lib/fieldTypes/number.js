/*!
 * Module dependencies.
 */

var util = require('util'),
	numeral = require('numeral'),
	utils = require('keystone-utils'),
	super_ = require('../field');

/**
 * Number FieldType Constructor
 * @extends Field
 * @api public
 */

function number(list, path, options) {
	this._nativeType = Number;
	this._underscoreMethods = ['format'];
	this._formatString = (options.format === false) ? false : (options.format || '0,0[.][000000000000]');
	if (this._formatString && 'string' !== typeof this._formatString) {
		throw new Error('FieldType.Number: options.format must be a string.');
	}
	number.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(number, super_);


/**
 * Formats the field value
 *
 * @api public
 */

number.prototype.format = function(item, format) {
	if (format || this._formatString) {
		return ('number' === typeof item.get(this.path)) ? numeral(item.get(this.path)).format(format || this._formatString) : '';
	} else {
		return item.get(this.path) || '';
	}
};


/**
 * Checks that a valid number has been provided in a data object
 *
 * An empty value clears the stored value and is considered valid
 *
 * @api public
 */

number.prototype.validateInput = function(data, required, item) {

	if (!(this.path in data) && item && (item.get(this.path) || item.get(this.path) === 0)) return true;

	if (data[this.path]) {
		var newValue = utils.number(data[this.path]);
		return (!isNaN(newValue));
	} else {
		return (required) ? false : true;
	}

};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

number.prototype.updateItem = function(item, data) {

	if (!(this.path in data))
		return;

	var newValue = utils.number(data[this.path]);

	if (!isNaN(newValue)) {
		if (newValue !== item.get(this.path)) {
			item.set(this.path, newValue);
		}
	} else if ('number' === typeof item.get(this.path)) {
		item.set(this.path, null);
	}

};


/*!
 * Export class
 */

exports = module.exports = number;
