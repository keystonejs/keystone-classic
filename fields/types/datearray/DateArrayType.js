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
	
	datearray.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(datearray, super_);

/**
 * Parses input using moment, sets the value, and returns the moment object.
 *
 * @api public
 */

datearray.prototype.parse = function(item) {
	var newValue = moment.apply(moment, Array.prototype.slice.call(arguments, 1));
	item.set(this.path, (newValue && moment(newValue).isValid()) ? newValue.toDate() : null);
	return newValue;
};

/**
 * Checks that a valid date has been provided in a data object
 *
 * An empty value clears the stored value and is considered valid
 *
 * @api public
 */

datearray.prototype.validateInput = function(data, required, item) {

	var value = this.getValueFromData(data);

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

	if ('string' === typeof value) {
		if (!moment(value).isValid()) {
			return false;
		}
	}

	if (Array.isArray(value)) {
		// Trim out empty fields
		value = value.filter(function(date) {
			return date.trim();
		});
		// If any date in the array is invalid, return false
		if (value.some(function (dateValue) { return !moment(dateValue).isValid(); })) {
			return false;
		}
	}

	return (value === undefined || Array.isArray(value) || ('string' === typeof value) || ('number' === typeof value));

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
