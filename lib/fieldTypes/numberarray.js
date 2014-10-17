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

function numberarray(list, path, options) {
	this._nativeType = [Number];

	this._underscoreMethods = ['format'];
	this._formatString = (options.format === false) ? false : (options.format || '0,0[.][000000000000]');
	if (this._formatString && 'string' !== typeof this._formatString) {
		throw new Error('FieldType.Number: options.format must be a string.');
	}
	numberarray.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(numberarray, super_);


/**
 * Formats the field value
 *
 * @api public
 */

numberarray.prototype.format = function(item, format) {
	if (format || this._formatString) {
		return ('number' === typeof item.get(this.path)) ? numeral(item.get(this.path)).format(format || this._formatString) : '';
	} else {
		return item.get(this.path) || '';
	}
};


/**
 * Checks that a valid array of number has been provided in a data object
 *
 * An empty value clears the stored value and is considered valid
 *
 * @api public
 */

numberarray.prototype.validateInput = function(data, required, item) {

	if (!(this.path in data) && item && (item.get(this.path) || item.get(this.path) === 0)) return true;

	if (data[this.path]) {
		if (!Array.isArray(data[this.path])) {
			var newValue = utils.number(data[this.path]);
			return (!isNaN(newValue));
		} else {
			var newValue = data[this.path];
			for (var index = 0; index < newValue.length; index++) {
				var newValueItem = utils.number(newValue[index]);
				if (isNaN(newValueItem)) {
					return false;
				}
			}
			return true;
		}
	} else {
		return (required) ? false : true;
	}

};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */


numberarray.prototype.updateItem = function(item, data) {

	if (!(this.path in data))
		return;

	var newValue = data[this.path];

	if (!Array.isArray(newValue)) {
		if (newValue != "") {
			var result = [utils.number(newValue)];
		} else {
			var result = [];
		}
	} else {
		var result = [];
		newValue.forEach(function(item, index) {
			if (item != "") {
				result.push(utils.number(item));
			}
		});
	}
	item.set(this.path, result);
};


/*!
 * Export class
 */

exports = module.exports = numberarray;
