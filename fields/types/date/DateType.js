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

function date(list, path, options) {
	
	this._nativeType = Date;
	this._underscoreMethods = ['format', 'moment', 'parse'];
	this._fixedSize = 'large';
	this._properties = ['formatString', 'yearRange'];
	
	this.formatString = (options.format === false) ? false : (options.format || 'Do MMM YYYY');
	this.yearRange = options.yearRange;
	
	if (this.formatString && 'string' !== typeof this.formatString) {
		throw new Error('FieldType.Date: options.format must be a string.');
	}
	
	date.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(date, super_);


/**
 * Formats the field value
 *
 * @api public
 */

date.prototype.format = function(item, format) {
	if (format || this.formatString) {
		return item.get(this.path) ? moment(item.get(this.path)).format(format || this.formatString) : '';
	} else {
		return item.get(this.path) || '';
	}
};


/**
 * Returns a new `moment` object with the field value
 *
 * @api public
 */

date.prototype.moment = function(item) {
	return moment(item.get(this.path));
};


/**
 * Parses input using moment, sets the value, and returns the moment object.
 *
 * @api public
 */

date.prototype.parse = function(item) {
	var newValue = moment.apply(moment, Array.prototype.slice.call(arguments, 1));
	item.set(this.path, (newValue && newValue.isValid()) ? newValue.toDate() : null);
	return newValue;
};

/**
 * Checks that a valid date has been provided in a data object
 *
 * An empty value clears the stored value and is considered valid
 *
 * @api public
 */

date.prototype.validateInput = function(data, required, item) {

	if (!(this.path in data) && item && item.get(this.path)) return true;

	var newValue = moment(data[this.path]);

	if (required && (!newValue || !newValue.isValid())) {
		return false;
	} else if (data[this.path] && newValue && !newValue.isValid()) {
		return false;
	} else {
		return true;
	}

};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

date.prototype.updateItem = function(item, data) {

	if (!(this.path in data)) {
		return;
	}

	var newValue = moment(data[this.path]);

	if (newValue && newValue.isValid()) {
		if (!item.get(this.path) || !newValue.isSame(item.get(this.path))) {
			item.set(this.path, newValue.toDate());
		}
	} else if (item.get(this.path)) {
		item.set(this.path, null);
	}

};


/*!
 * Export class
 */

exports = module.exports = date;
