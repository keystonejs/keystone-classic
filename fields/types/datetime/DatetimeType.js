/*!
 * Module dependencies.
 */

var util = require('util');
var moment = require('moment');
var super_ = require('../Type');

var parseFormats = ['YYYY-MM-DD', 'YYYY-MM-DD h:m:s a', 'YYYY-MM-DD h:m a', 'YYYY-MM-DD H:m:s', 'YYYY-MM-DD H:m'];

/**
 * DateTime FieldType Constructor
 * @extends Field
 * @api public
 */

function datetime(list, path, options) {
	
	this._nativeType = Date;
	this._underscoreMethods = ['format', 'moment', 'parse'];
	this._fixedSize = 'large';
	this._properties = ['formatString', 'isUTC'];
	
	this.typeDescription = 'date and time';
	this.parseFormatString = options.parseFormat || parseFormats;
	this.formatString = (options.format === false) ? false : (options.format || 'YYYY-MM-DD h:m:s a');
	this.isUTC = options.utc || false;
	
	if (this.formatString && 'string' !== typeof this.formatString) {
		throw new Error('FieldType.DateTime: options.format must be a string.');
	}
	
	datetime.super_.call(this, list, path, options);

	this.paths = {
		date: this._path.append('_date'),
		time: this._path.append('_time')
	};
	
}

/*!
 * Inherit from Field
 */

util.inherits(datetime, super_);


/**
 * Formats the field value
 *
 * @api public
 */
datetime.prototype.format = function(item, format) {
	if (format || this.formatString) {
		return item.get(this.path) ? this.moment(item).format(format || this.formatString) : '';
	} else {
		return item.get(this.path) || '';
	}
};


/**
 * Returns a new `moment` object with the field value
 *
 * @api public
 */

datetime.prototype.moment = function(item) {
	var m = moment(item.get(this.path));
	if (this.isUTC) m.utc();
	return m;
};


/**
 * Parses input using moment, sets the value, and returns the moment object.
 *
 * @api public
 */

datetime.prototype.parse = function(item) {
	var m = this.isUTC ? moment.utc : moment;
	var newValue = m.apply(m, Array.prototype.slice.call(arguments, 1));
	item.set(this.path, (newValue && newValue.isValid()) ? newValue.toDate() : null);
	return newValue;
};


/**
 * Get the value from a data object; may be simple or a pair of fields
 *
 * @api private
 */

datetime.prototype.getInputFromData = function(data) {
	if (this.paths.date in data && this.paths.time in data) {
		return (data[this.paths.date] + ' ' + data[this.paths.time]).trim();
	} else {
		return data[this.path];
	}
};


/**
 * Checks that a valid date has been provided in a data object
 *
 * An empty value clears the stored value and is considered valid
 *
 * @api public
 */

datetime.prototype.validateInput = function(data, required, item) {
	if (!(this.path in data && !(this.paths.date in data && this.paths.time in data)) && item && item.get(this.path)) return true;
	var newValue = moment(this.getInputFromData(data), parseFormats);
	if (required && (!newValue || !newValue.isValid())) {
		return false;
	} else if (this.getInputFromData(data) && newValue && !newValue.isValid()) {
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

datetime.prototype.updateItem = function(item, data) {
	if (!(this.path in data || (this.paths.date in data && this.paths.time in data))) {
		return;
	}
	var m = this.isUTC ? moment.utc : moment;
	var newValue = m(this.getInputFromData(data), parseFormats);
	if (newValue.isValid()) {
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

exports = module.exports = datetime;
