var FieldType = require('../Type');
var moment = require('moment');
var util = require('util');

/**
 * Date FieldType Constructor
 * @extends Field
 * @api public
 */

function date(list, path, options) {
	this._nativeType = Date;
	this._underscoreMethods = ['format', 'moment', 'parse'];
	this._fixedSize = 'large';
	this._properties = ['dateFormat', 'datePlaceholder', 'yearRange', 'isUTC'];
	this.parseDateFormat = options.parseFormat || 'YYYY-MM-DD';
	this.dateFormat = (options.format === false) ? false : (options.format || 'YYYY-MM-DD');
	this.datePlaceholder = this.dateFormat ? 'e.g. ' + moment().format(this.parseDateFormat) : '';
	this.yearRange = options.yearRange;
	this.isUTC = options.utc || false;
	if (this.dateFormat && 'string' !== typeof this.dateFormat) {
		throw new Error('FieldType.Date: options.format must be a string.');
	}
	date.super_.call(this, list, path, options);
}
util.inherits(date, FieldType);

/**
 * Add filters to a query
 */
date.prototype.addFilterToQuery = function(filter, query) {
	query = query || {};
	if (filter.mode === 'between') {
		if (filter.after && filter.before) {
			filter.after = moment(filter.after);
			filter.before = moment(filter.before);
			if (filter.after.isValid() && filter.before.isValid()) {
				query[this.path] = {
					$gte: filter.after.startOf('day').toDate(),
					$lte: filter.before.endOf('day').toDate()
				};
			}
		}
	} else if (filter.value) {
		filter.value = moment(filter.value);
		if (filter.value.isValid()) {
			var after = filter.value.startOf('day').toDate();
			var before = filter.value.endOf('day').toDate();
			if (filter.mode === 'after') {
				query[this.path] = { $gte: after };
			} else if (filter.mode === 'before') {
				query[this.path] = { $lte: before };
			} else {
				query[this.path] = { $gte: after, $lte: before };
			}
		}
	}
	return query;
};

/**
 * Formats the field value
 */
date.prototype.format = function(item, format) {
	if (format || this.dateFormat) {
		return item.get(this.path) ? this.moment(item).format(format || this.dateFormat) : '';
	} else {
		return item.get(this.path) || '';
	}
};

/**
 * Returns a new `moment` object with the field value
 */
date.prototype.moment = function(item) {
	var m = moment(item.get(this.path));
	if (this.isUTC) m.utc();
	return m;
};

/**
 * Parses input using moment, sets the value, and returns the moment object.
 */
date.prototype.parse = function(item) {
	var m = this.isUTC ? moment.utc : moment;
	var newValue = m.apply(m, Array.prototype.slice.call(arguments, 1));
	item.set(this.path, (newValue && newValue.isValid()) ? newValue.toDate() : null);
	return newValue;
};

/**
 * Checks that a valid date has been provided in a data object
 * An empty value clears the stored value and is considered valid
 */
date.prototype.validateInput = function(data, required, item) {
	if (!(this.path in data) && item && item.get(this.path)) return true;
	var newValue = moment(data[this.path], this.parseDateFormat);
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
date.prototype.updateItem = function(item, data) {
	if (!(this.path in data)) {
		return;
	}
	var m = this.isUTC ? moment.utc : moment;
	var newValue = m(data[this.path], this.parseDateFormat);
	if (newValue.isValid()) {
		if (!item.get(this.path) || !newValue.isSame(item.get(this.path))) {
			item.set(this.path, newValue.toDate());
		}
	} else if (item.get(this.path)) {
		item.set(this.path, null);
	}
};

/* Export Field Type */
exports = module.exports = date;
