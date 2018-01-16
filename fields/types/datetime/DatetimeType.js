var moment = require('moment');
var DateType = require('../date/DateType');
var FieldType = require('../Type');
var util = require('util');
var _ = require('underscore');

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
	this._properties = ['formatString', 'dateFormat', 'timeFormat', 'datePlaceholder', 'timePlaceholder', 'isUTC'];
	this.typeDescription = 'date and time';
	this.parseFormatString = options.parseFormat || parseFormats;
	this.formatString = (options.format === false) ? false : (options.format || 'YYYY-MM-DD h:mm:ss a');

	// Create an array of moment time format characters to help find where the time portion of the format string beings
	var timeOptions = ['h', 'H', 'm', 's', 'S'];
	var timeIndex = -1;

	var that = this;

	if(this.formatString) {
		// Loop through each moment time format character to determine which begins the time portion of format to segregate date from time
		_.each(timeOptions, function(timeChar) {
			var charIndex = that.formatString.indexOf(timeChar);

			if((charIndex !== -1 && charIndex < timeIndex) || (charIndex !== -1 && timeIndex === -1)) {
				timeIndex = charIndex;
			}
		});

		this.dateFormat = this.formatString.slice(0, timeIndex).trim();
		this.timeFormat = this.formatString.slice(timeIndex).trim();
		this.datePlaceholder = 'e.g. ' + moment().format(this.dateFormat);
		this.timePlaceholder = 'e.g. ' + moment().format(this.timeFormat);

	} else {
		this.dateFormat = '';
		this.timeFormat = '';
		this.datePlaceholder = '';
		this.timePlaceholder = '';
	}

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
util.inherits(datetime, FieldType);

/* Inherit from DateType prototype */
datetime.prototype.addFilterToQuery = DateType.prototype.addFilterToQuery;
datetime.prototype.format = DateType.prototype.format;
datetime.prototype.moment = DateType.prototype.moment;
datetime.prototype.parse = DateType.prototype.parse;

/**
 * Get the value from a data object; may be simple or a pair of fields
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
 * An empty value clears the stored value and is considered valid
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
 */
datetime.prototype.updateItem = function(item, data) {
	if (!(this.path in data || (this.paths.date in data && this.paths.time in data))) {
		return;
	}
	var m = this.isUTC ? moment.utc : moment;
	var newValue = m(this.getInputFromData(data), this.formatString);
	if (newValue.isValid()) {
		if (!item.get(this.path) || !newValue.isSame(item.get(this.path))) {
			item.set(this.path, newValue.toDate());
		}
	} else if (item.get(this.path)) {
		item.set(this.path, null);
	}
};

/* Export Field Type */
exports = module.exports = datetime;
