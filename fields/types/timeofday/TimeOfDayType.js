var moment = require('moment');
var DateType = require('../date/DateType');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');
var TextType = require('../text/TextType');

var parseFormats = ['h:m a', 'H:m'];

function timeofday (list, path, options) {
	this._nativeType = Date;
	this._underscoreMethods = ['format', 'moment', 'parse'];
	this._fixedSize = 'full';
	this._properties = ['formatString', 'isUTC'];
	this.typeDescription = 'time of day';
	this.parseFormatString = options.parseFormat || parseFormats;
	this.formatString = (options.format === false) ? false : (options.format || 'h:m a');
	this.isUTC = true;
	if (this.formatString && typeof this.formatString !== 'string') {
		throw new Error('FieldType.timeofday: options.format must be a string.');
	}
	timeofday.super_.call(this, list, path, options);
	this.paths = {
		time: this._path.append('_time'),
	};
}

timeofday.properName = 'TimeOfDay';

util.inherits(timeofday, FieldType);

timeofday.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

timeofday.prototype.addFilterToQuery = DateType.prototype.addFilterToQuery;
timeofday.prototype.format = DateType.prototype.format;
timeofday.prototype.moment = DateType.prototype.moment;


timeofday.prototype.getInputFromData = function (data) {
	return this.getValueFromData(data, '_time');
};

timeofday.prototype.parse = function (value) {
	var newDate = new Date('Jan 1 1970 ' + value);
	var newUtcDate = Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), newDate.getHours(), newDate.getMinutes());
	return new Date(newUtcDate);
};

timeofday.prototype.validateInput = function (data, callback) {

	console.log('validateInput');
	var value = this.getInputFromData(data);
	// If the value is null, undefined or an empty string
	// bail early since updateItem sanitizes that just fine
	var result = true;
	if (value) {
		result = this.parse(value, this.parseFormatString, true).isValid();
	}
	utils.defer(callback, result);
};

timeofday.prototype.inputIsValid = function (data, required, item) {

	if (!(this.path in data && !(this.paths.time in data)) && item && item.get(this.path)) return true;
	var newValue = moment(this.getInputFromData(data), parseFormats);
	if (required && (!newValue || !newValue.isValid())) {
		return false;
	} else if (this.getInputFromData(data) && newValue && !newValue.isValid()) {
		return false;
	} else {
		return true;
	}
};


timeofday.prototype.updateItem = function (item, data, callback) {

	var value = this.getInputFromData(data);
	if (value !== undefined) {
		if (value !== null && value !== '') {
			// If the value is not null, empty string or undefined, parse it
			var newValue = this.parse(value);
			item.set(this.path, newValue);
		}
		// If it's null or empty string, clear it out
	} else {
		item.set(this.path, null);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = timeofday;
