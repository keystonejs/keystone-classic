var util = require('util');
var moment = require('moment');
var super_ = require('../Type');
var debug = require('debug')('keystone:fields:datearray');
var DateType = require('../date/DateType');

/**
 * Date FieldType Constructor
 * @extends Field
 * @api public
 */

function datearray(list, path, options) {
	
	this._nativeType = [Date];
	this._defaultSize = 'medium';
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

/* Inherit from DateType prototype */
datearray.prototype.addFilterToQuery = DateType.prototype.addFilterToQuery;

/**
 * Add filters to a query
 */
datearray.prototype.addFilterToQuery1 = function(filter, query) {
	query = query || {};
	if (filter.mode === 'between') {
		
		if (filter.after && filter.before) {
			
			filter.after = moment(filter.after);
			filter.before = moment(filter.before);
			
			if (filter.after.isValid() && filter.before.isValid()) {
				query[this.path] = {
					$gte: filter.after.startOf('day').toISOString(),
					$lte: filter.before.endOf('day').toISOString()
				};
			}
		}
		
	} else if (filter.value) {
		
		var day = {
			moment: moment(filter.value).utc()
		};
		//day.start = day.moment.subtract(1, 'day').endOf('day').toISOString();
		//day.end = moment(filter.value).utc().add(1, 'day').startOf('day').toISOString();
		day.start = day.moment.startOf('day').toISOString();
		day.end = moment(filter.value).utc().endOf('day').toISOString();
		
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
		query[this.path] =  { $not: query[this.path] };	
	}
	
	debug(query[this.path]);
	
	return query;
};

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

datearray.prototype.inputIsValid = function(data, required, item) {

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

module.exports = datearray;
