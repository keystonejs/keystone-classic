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
