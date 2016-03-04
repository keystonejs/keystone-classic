var moment = require('moment');
var DateType = require('../date/DateType');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');
var validators = require('../validators');

var parseFormats = ['YYYY-MM-DD', 'YYYY-MM-DD h:m:s a', 'YYYY-MM-DD h:m a', 'YYYY-MM-DD H:m:s', 'YYYY-MM-DD H:m'];

/**
 * DateTime FieldType Constructor
 * @extends Field
 * @api public
 */
function datetime (list, path, options) {
	this._nativeType = Date;
	this._underscoreMethods = ['format', 'moment', 'parse'];
	this._fixedSize = 'full';
	this._properties = ['formatString', 'isUTC'];
	this.typeDescription = 'date and time';
	this.parseFormatString = options.parseFormat || parseFormats;
	this.formatString = (options.format === false) ? false : (options.format || 'YYYY-MM-DD h:m:s a');
	this.isUTC = options.utc || false;
	if (this.formatString && typeof this.formatString !== 'string') {
		throw new Error('FieldType.DateTime: options.format must be a string.');
	}
	datetime.super_.call(this, list, path, options);
	this.paths = {
		date: this._path.append('_date'),
		time: this._path.append('_time'),
	};
}
util.inherits(datetime, FieldType);

/* Use text validators */
datetime.prototype.validateRequiredInput = validators.text.required;

/* Inherit from DateType prototype */
datetime.prototype.addFilterToQuery = DateType.prototype.addFilterToQuery;
datetime.prototype.format = DateType.prototype.format;
datetime.prototype.moment = DateType.prototype.moment;
datetime.prototype.validateInput = DateType.prototype.validateInput;

/**
 * Get the value from a data object; may be simple or a pair of fields
 */
datetime.prototype.getInputFromData = function (data) {
	var dateValue = this.getValueFromData(data, '_date');
	var timeValue = this.getValueFromData(data, '_time');
	if (dateValue && timeValue) {
		return dateValue + ' ' + timeValue;
	}
	return this.getValueFromData(data);
};

/**
 * Parses input with the correct moment version (normal or utc) and uses
 * either the provided input format or the default set
 */
datetime.prototype.parse = function (input, format) {
	var m = this.isUTC ? moment.utc : moment;
	return m(input, format || parseFormats);
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
	var input = this.getInputFromData(data);
	if (input === undefined) return process.nextTick(callback);
	var newValue = this.parse(input);
	var oldValue = item.get(this.path);
	if (newValue.isValid()) {
		if (!oldValue || !newValue.isSame(oldValue)) {
			item.set(this.path, newValue.toDate());
		}
	} else if (oldValue) {
		item.set(this.path, null);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = datetime;
