var _ = require('lodash');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');

// Validation and value parsing regular expression
var REGEXP_LNGLAT = /^\s*(\-?\d+(?:\.\d+)?)\s*\,\s*(\-?\d+(?:\.\d+)?)\s*$/;

/**
 * Geo FieldType Constructor
 * @extends Field
 * @api public
 */
function geopoint (list, path, options) {
	this._fixedSize = 'medium';
	// TODO: implement filtering
	options.nofilter = true;
	geopoint.super_.call(this, list, path, options);
}
util.inherits(geopoint, FieldType);

/**
 * Registers the field on the List's Mongoose Schema.
 * Adds a 2dsphere indexed lat/lng pair
 */
geopoint.prototype.addToSchema = function () {
	this.list.schema.path(this.path, _.defaults({ type: [Number], index: '2dsphere' }, this.options));
	this.bindUnderscoreMethods();
};

/**
 * Gets the field's data from an Item, as used by the React components
 */
geopoint.prototype.getData = function (item) {
	var points = item.get(this.path);
	return (points && points.length === 2) ? points : [];
};

/**
 * Formats the field value
 */
geopoint.prototype.format = function (item) {
	if (item.get(this.path)) {
		return item.get(this.path).reverse().join(', ');
	}
	return null;
};

/**
 * Asynchronously confirms that the provided value is valid
 */
geopoint.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	var result = false;
	if (value === undefined) {
		result = true;
	} else {
		if (Array.isArray(value)) {
			value = value.length === 2 ? value.join(',') : '';
		}
		if (typeof value === 'string') {
			result = REGEXP_LNGLAT.test(value);
		}
	}
	utils.defer(callback, result);
};

/**
 * Asynchronously confirms that the a value is present
 */
geopoint.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	var result = (value || (value === undefined && item.get(this.path) && item.get(this.path).length === 2)) ? true : false;
	utils.defer(callback, result);
};

/**
 * Validates that a value for this field has been provided in a data object
 *
 * Deprecated
 */
geopoint.prototype.inputIsValid = function (data, required, item) { // eslint-disable-line no-unused-vars
	var values = this.getValueFromData(data);
	// Input is valid if the field is not required, and not present
	if (values === undefined && !required) return true;
	if (Array.isArray(values)) {
		values = values.length === 2 ? values.join(',') : '';
	}
	if (typeof values !== 'string') return false;
	if ((values === '' || values.charAt(0) === ',' || values.charAt(values.length - 1) === ',') && !required) return true;
	return REGEXP_LNGLAT.test(values);
};

/**
 * Updates the value for this field in the item from a data object
 */
geopoint.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);
	if (value === undefined) return process.nextTick(callback);
	if (typeof value === 'string') {
		// Value should be formatted lng,lat
		var values = REGEXP_LNGLAT.exec(value);
		if (values) {
			item.set(this.path, [values[1], values[2]]);
		} else {
			item.set(this.path, undefined);
		}
	} else if (Array.isArray(value)) {
		if (value.length === 2 && REGEXP_LNGLAT.test(_.compact(value).join(','))) {
			item.set(this.path, value);
		} else {
			item.set(this.path, undefined);
		}
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = geopoint;
