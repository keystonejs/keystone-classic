var moment = require('moment');
var DateType = require('../date/DateType');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');

// ISO_8601 is needed for the automatically created createdAt and updatedAt fields
var parseFormats = ['YYYY-MM-DD', 'YYYY-MM-DD h:m:s a', 'YYYY-MM-DD h:m a', 'YYYY-MM-DD H:m:s', 'YYYY-MM-DD H:m', 'YYYY-MM-DD h:mm:s a Z', moment.ISO_8601];

/**
 * DateTime FieldType Constructor
 * @extends Field
 * @api public
 */
function datetime (list, path, options) {
	this._nativeType = Date;
	this._underscoreMethods = ['format', 'moment', 'parse'];
	this._fixedSize = 'full';
	this._properties = ['formatDateString', 'formatTimeString', 'formatTzString', 'isUTC'];
	this.typeDescription = 'date and time';
	this.parseFormatString = parseFormats.slice(0);
	this.formatDateString = (options.dateFormat === false) ? false : (options.dateFormat || 'YYYY-MM-DD');
	this.formatTimeString = (options.timeFormat === false) ? false : (options.timeFormat || 'h:mm:ss a');
	this.formatTzString = (options.tzFormat === false) ? false : (options.tzFormat || 'Z');
	this.isUTC = options.utc || false;
	if (this.formatDateString && typeof this.formatDateString !== 'string') {
		throw new Error('FieldType.DateTime: options.dateFormat must be a string.');
	}
	if (this.formatTimeString && typeof this.formatTimeString !== 'string') {
		throw new Error('FieldType.DateTime: options.timeFormat must be a string.');
	}
	if (this.formatTzString && typeof this.formatTzString !== 'string') {
		throw new Error('FieldType.DateTime: options.tzFormat must be a string.');
	}

	// For backward compatibility, if parseFormat option is specified, add it to the parseFormatString array
	if (options.parseFormat) {
		if (Array.isArray(options.parseFormat)) {
			this.parseFormatString = this.parseFormatString.concat(options.parseFormat);
		} else if (typeof options.parseFormat === 'string') {
			this.parseFormatString.push(options.parseFormat);
		}
	}

	// If a custom format is specified by the user, it should be added to the parseFormatString array to ensure
	// successful validation
	if (this.formatDateString || this.formatTimeString || this.formatTzString) {
		let customFormat = [];

		if (this.formatDateString) customFormat.push(this.formatDateString);
		if (this.formatTimeString) customFormat.push(this.formatTimeString);
		if (this.formatTzString) customFormat.push(this.formatTzString);

		this.parseFormatString.push(customFormat.join(' '));
	}

	datetime.super_.call(this, list, path, options);
	this.paths = {
		date: this.path + '_date',
		time: this.path + '_time',
		tzOffset: this.path + '_tzOffset',
	};
}

datetime.properName = 'Datetime';
util.inherits(datetime, FieldType);

/* Inherit generic methods */
datetime.prototype.format = DateType.prototype.format;
datetime.prototype.moment = DateType.prototype.moment;
datetime.prototype.parse = DateType.prototype.parse;
datetime.prototype.addFilterToQuery = DateType.prototype.addFilterToQuery;

/**
 * Get the value from a data object; may be simple or a pair of fields
 */
datetime.prototype.getInputFromData = function (data) {
	var dateValue = this.getValueFromData(data, '_date');
	var timeValue = this.getValueFromData(data, '_time');
	var tzOffsetValue = this.getValueFromData(data, '_tzOffset');
	if (dateValue && timeValue) {
		var combined = dateValue + ' ' + timeValue;
		if (typeof tzOffsetValue !== 'undefined') {
			combined += ' ' + tzOffsetValue;
		}
		return combined;
	}

	return this.getValueFromData(data);
};

datetime.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getInputFromData(data);
	var result = !!value;
	if (value === undefined && item.get(this.path)) {
		result = true;
	}

	utils.defer(callback, result);
};

/**
 * Validates the input we get to be a valid date,
 * undefined, null or an empty string
 */
datetime.prototype.validateInput = function (data, callback) {
	var value = this.getInputFromData(data);
	// If the value is null, undefined or an empty string
	// bail early since updateItem sanitizes that just fine
	var result = true;
	if (value) {
		result = this.parse(value, this.parseFormatString, true).isValid();
	}

	utils.defer(callback, result);
};

/**
 * Checks that a valid date has been provided in a data object
 * An empty value clears the stored value and is considered valid
 *
 * Deprecated
 */
datetime.prototype.inputIsValid = function (data, required, item) {
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
 */
datetime.prototype.updateItem = function (item, data, callback) {
	// Get the values from the data
	var value = this.getInputFromData(data);
	if (value !== undefined) {
		if (value !== null && value !== '') {
			// If the value is not null, empty string or undefined, parse it
			var newValue = this.parse(value, this.parseFormatString, true);
			// If it's valid and not the same as the last value, save it
			if (!item.get(this.path) || !newValue.isSame(item.get(this.path))) {
				item.set(this.path, newValue.toDate());
			}
			// If it's null or empty string, clear it out
		} else {
			item.set(this.path, null);
		}
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = datetime;
