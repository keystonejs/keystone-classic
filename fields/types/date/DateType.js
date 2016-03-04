var FieldType = require('../Type');
var moment = require('moment');
var util = require('util');
var utils = require('keystone-utils');
var validators = require('../validators');

/**
 * Date FieldType Constructor
 * @extends Field
 * @api public
 */

function date (list, path, options) {
	this._nativeType = Date;
	this._underscoreMethods = ['format', 'moment', 'parse'];
	this._fixedSize = 'medium';
	this._properties = ['formatString', 'yearRange', 'isUTC', 'inputFormat'];
	this.parseFormatString = options.inputFormat || 'YYYY-MM-DD';
	this.formatString = (options.format === false) ? false : (options.format || 'Do MMM YYYY');

	this.yearRange = options.yearRange;
	this.isUTC = options.utc || false;
	if (this.formatString && typeof this.formatString !== 'string') {
		throw new Error('FieldType.Date: options.format must be a string.');
	}
	date.super_.call(this, list, path, options);
}
util.inherits(date, FieldType);

/* Use text validators */
date.prototype.validateRequiredInput = validators.text.required;

/**
 * Add filters to a query
 */
date.prototype.addFilterToQuery = function (filter, query) {
	query = query || {};
	if (filter.mode === 'between') {
		if (filter.after && filter.before) {
			filter.after = moment(filter.after);
			filter.before = moment(filter.before);
			if (filter.after.isValid() && filter.before.isValid()) {
				query[this.path] = {
					$gte: filter.after.startOf('day').toDate(),
					$lte: filter.before.endOf('day').toDate(),
				};
			}
		}
	} else if (filter.value) {
		var day = {
			moment: moment(filter.value),
		};
		day.start = day.moment.startOf('day').toDate();
		day.end = moment(filter.value).endOf('day').toDate();
		if (day.moment.isValid()) {
			if (filter.mode === 'after') {
				query[this.path] = { $gt: day.end };
			} else if (filter.mode === 'before') {
				query[this.path] = { $lt: day.start };
			} else {
				query[this.path] = { $gte: day.start, $lte: day.end };
			}
		}
	}
	if (filter.inverted) {
		query[this.path] = { $not: query[this.path] };
	}
	return query;
};

/**
 * Formats the field value
 */
date.prototype.format = function (item, format) {
	if (format || this.formatString) {
		return item.get(this.path) ? this.moment(item).format(format || this.formatString) : '';
	} else {
		return item.get(this.path) || '';
	}
};

/**
 * Returns a new `moment` object with the field value
 */
date.prototype.moment = function (item) {
	var m = moment(item.get(this.path));
	if (this.isUTC) m.utc();
	return m;
};

/**
 * Parses input with the correct moment version (normal or utc) and uses
 * either the provided input format or the default for the field
 */
date.prototype.parse = function (input, format) {
	var m = this.isUTC ? moment.utc : moment;
	return m(input, format || this.parseFormatString);
};

/**
 * Asynchronously confirms that the provided date is valid
 */
date.prototype.validateInput = function (data, callback) {
	var input = this.getInputFromData(data);
	var result = true;
	if (input) {
		result = this.parse(input).isValid();
	}
	utils.defer(callback, result);
};

/**
 * Checks that a valid date has been provided in a data object
 * An empty value clears the stored value and is considered valid
 *
 * Deprecated
 */
date.prototype.inputIsValid = function (data, required, item) {
	if (!(this.path in data) && item && item.get(this.path)) return true;
	var newValue = moment(data[this.path], this.parseFormatString);
	if (required && (!newValue.isValid())) {
		return false;
	} else if (data[this.path] && newValue && !newValue.isValid()) {
		return false;
	} else {
		return true;
	}
};

/**
 * Updates the value for this field in the item from a data object
 */
date.prototype.updateItem = function (item, data, callback) {
	if (!(this.path in data)) {
		return process.nextTick(callback);
	}
	var m = this.isUTC ? moment.utc : moment;
	var newValue = m(data[this.path], this.parseFormatString);
	if (newValue.isValid()) {
		if (!item.get(this.path) || !newValue.isSame(item.get(this.path))) {
			item.set(this.path, newValue.toDate());
		}
	} else if (item.get(this.path)) {
		item.set(this.path, null);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = date;
