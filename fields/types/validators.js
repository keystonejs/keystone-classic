/**
 * This file contains default validation methods for simple data types
 * These methods can be added to Field prototypes to reduce code repetition
 * and/or interdependencies between types with similar validation logic
 */

var utils = require('keystone-utils');

/* Booleans */

// Boolean fields are set to true when truthy, except the string 'false'
// Falsy values always set the field value to false, to account for undefined
// values submitted when HTML checkbox inputs are used. The limitation is that
// it isn't possible to _not_ set a value for a Boolean field if the field is
// being updated, even by providing an undefined value in the data object.

exports.boolean = {
	input: function (data, callback) {
		utils.defer(callback, true);
	},
	required: function (item, data, callback) {
		var value = this.getValueFromData(data);
		var result = (value && value !== 'false') || item.get(this.path) ? true : false;
		utils.defer(callback, result);
	},
};

/* Text */

// Text fields accept string input. Required text fields don't allow an empty
// string. Text fields aren't updated when an undefined value is provided.

// These methods are tested by the `text` field type unit tests

exports.text = {
	input: function (data, callback) {
		var value = this.getValueFromData(data);
		var result = value === undefined || typeof value === 'string';
		utils.defer(callback, result);
	},
	required: function (item, data, callback) {
		var value = this.getValueFromData(data);
		var result = !!value;
		if (value === undefined && item.get(this.path)) {
			result = true;
		}
		utils.defer(callback, result);
	},
};

/* Number */

// Number fields accept string or numeric input; strings are converted to
// numbers. Required number fields don't allow an empty string or undefined.
// Number fields aren't updated when an undefined value is provided.

// These methods are tested by the `number` field type unit tests

exports.number = {
	input: function (data, callback) {
		var value = this.getValueFromData(data);
		var result = value === undefined || typeof value === 'number';
		if (typeof value === 'string') {
			value = utils.number(value);
			result = !isNaN(value);
		}
		utils.defer(callback, result);
	},
	required: function (item, data, callback) {
		var value = this.getValueFromData(data);
		var result = !!(value || typeof value === 'number');
		if (value === undefined && item.get(this.path)) {
			result = true;
		}
		utils.defer(callback, result);
	},
};
