/*!
 * Module dependencies.
 */

var util = require('util'),
	moment = require('moment'),
	super_ = require('../Type');

/**
 * Date FieldType Constructor
 * @extends Field
 * @api public
 */

function datearray(list, path, options) {
	
	this._nativeType = [Date];
	this._fixedSize = 'large';
	this._underscoreMethods = ['format'];
	this._properties = ['formatString'];

	this.parseFormatString = options.parseFormat || 'YYYY-MM-DD';
	this.formatString = (options.format === false) ? false : (options.format || 'Do MMM YYYY');
	
	if (this.formatString && 'string' !== typeof this.formatString) {
		throw new Error('FieldType.Date: options.format must be a string.');
	}
	
	datearray.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(datearray, super_);

/**
 * Formats the field value
 *
 * @api public
 */

datearray.prototype.format = function(item, format) {
	if (format || this.formatString) {
		return item.get(this.path) ? moment(item.get(this.path)).format(format || this.formatString) : '';
	} else {
		return item.get(this.path) || '';
	}
};

/**
 * Checks that a valid array of dates has been provided in a data object
 *
 * An empty value clears the stored value and is considered valid
 *
 * @api public
 */

datearray.prototype.validateInput = function(data, required, item) {

	var value = this.getValueFromData(data);
	var parseFormatString = this.parseFormatString;

	if ('string' === typeof value) {
		if (!moment(value, parseFormatString).isValid()) {
			return false;
		}
		value = [value];
	}
	
	if (required) {
		if (value === undefined && item && item.get(this.path) && item.get(this.path).length) {
			return true;
		}
		if (value === undefined || !Array.isArray(value)) {
			return false;
		}
		if (Array.isArray(value) && !value.length) {
			return false;
		}
	}
	
	if (Array.isArray(value)) {
		// filter out empty fields
		value = value.filter(function(date) {
			return date.trim() !== '';
		});
		// if there are no values left, and requried is true, return false
		if (required && !value.length) {
			return false;
		}
		// if any date in the array is invalid, return false
		if (value.some(function (dateValue) { return !moment(dateValue, parseFormatString).isValid(); })) {
			return false;
		}
	}

	return (value === undefined || Array.isArray(value));

};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

datearray.prototype.updateItem = function(item, data) {

	var value = this.getValueFromData(data);
	
	if (value !== undefined) {
		if (Array.isArray(value)) {
			// Only save valid dates
			value = value.filter(function(date) {
				return moment(date).isValid();
			});
		}
		if (value === null) {
			value = [];
		}
		if ('string' === typeof value) {
			if (moment(value).isValid()) {
				value = [value];
			}
		}
		if (Array.isArray(value)) {
			item.set(this.path, value);
		}
	} else item.set(this.path, []);
};


/*!
 * Export class
 */

exports = module.exports = datearray;
