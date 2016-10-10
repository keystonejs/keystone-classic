var _ = require('lodash');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');

/**
 * Select FieldType Constructor
 * @extends Field
 * @api public
 */
function select (list, path, options) {
	this.ui = options.ui || 'select';
	this.numeric = options.numeric ? true : false;
	this._nativeType = (options.numeric) ? Number : String;
	this._underscoreMethods = ['format', 'pluck'];
	this._properties = ['ops', 'numeric'];
	if (typeof options.options === 'string') {
		options.options = options.options.split(',');
	}
	if (!Array.isArray(options.options)) {
		throw new Error('Select fields require an options array.');
	}
	this.ops = options.options.map(function (i) {
		var op = typeof i === 'string' ? { value: i.trim(), label: utils.keyToLabel(i) } : i;
		if (!_.isObject(op)) {
			op = { label: '' + i, value: '' + i };
		}
		if (options.numeric && !_.isNumber(op.value)) {
			op.value = Number(op.value);
		}
		return op;
	});
	// undefined options.emptyOption defaults to true
	if (options.emptyOption === undefined) {
		options.emptyOption = true;
	}
	// ensure this.emptyOption is a boolean
	this.emptyOption = !!options.emptyOption;
	// cached maps for options, labels and values
	this.map = utils.optionsMap(this.ops);
	this.labels = utils.optionsMap(this.ops, 'label');
	this.values = _.map(this.ops, 'value');
	select.super_.call(this, list, path, options);
}
select.properName = 'Select';
util.inherits(select, FieldType);

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * Adds a virtual for accessing the label of the selected value,
 * and statics to the Schema for converting a value to a label,
 * and retrieving all of the defined options.
 */
select.prototype.addToSchema = function (schema) {
	var field = this;
	this.paths = {
		data: this.options.dataPath || this.path + 'Data',
		label: this.options.labelPath || this.path + 'Label',
		options: this.options.optionsPath || this.path + 'Options',
		map: this.options.optionsMapPath || this.path + 'OptionsMap',
	};
	schema.path(this.path, _.defaults({
		type: this._nativeType,
		enum: this.values,
		set: function (val) {
			return (val === '' || val === null || val === false) ? undefined : val;
		},
	}, this.options));
	schema.virtual(this.paths.data).get(function () {
		return field.map[this.get(field.path)];
	});
	schema.virtual(this.paths.label).get(function () {
		return field.labels[this.get(field.path)];
	});
	schema.virtual(this.paths.options).get(function () {
		return field.ops;
	});
	schema.virtual(this.paths.map).get(function () {
		return field.map;
	});
	this.bindUnderscoreMethods();
};

/**
 * Returns a key value from the selected option
 */
select.prototype.pluck = function (item, property, _default) {
	var option = item.get(this.paths.data);
	return (option) ? option[property] : _default;
};

/**
 * Retrieves a shallow clone of the options array
 */
select.prototype.cloneOps = function () {
	return _.map(this.ops, _.clone);
};

/**
 * Retrieves a shallow clone of the options map
 */
select.prototype.cloneMap = function () {
	return utils.optionsMap(this.ops, true);
};

/**
 * Add filters to a query
 */
select.prototype.addFilterToQuery = function (filter) {
	var query = {};
	if (!Array.isArray(filter.value)) {
		if (filter.value) {
			filter.value = [filter.value];
		} else {
			filter.value = [];
		}
	}
	if (filter.value.length > 1) {
		query[this.path] = (filter.inverted) ? { $nin: filter.value } : { $in: filter.value };
	} else if (filter.value.length === 1) {
		query[this.path] = (filter.inverted) ? { $ne: filter.value[0] } : filter.value[0];
	} else {
		query[this.path] = (filter.inverted) ? { $nin: ['', null] } : { $in: ['', null] };
	}
	return query;
};

/**
 * Asynchronously confirms that the provided value is valid
 */
select.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	if (typeof value === 'string' && this.numeric) {
		value = utils.number(value);
	}
	var result = value === undefined || value === null || value === '' || (value in this.map) ? true : false;
	utils.defer(callback, result);
};

/**
 * Asynchronously confirms that the provided value is present
 */
select.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	var result = false;
	if (value === undefined) {
		if (item.get(this.path)) {
			result = true;
		}
	} else if (value) {
		if (value !== '') {
			// This is already checkind in validateInput, but it doesn't hurt
			// to check again for security
			if (value in this.map) {
				result = true;
			}
		}
	}
	utils.defer(callback, result);
};

/**
 * Validates that a valid option has been provided in a data object
 *
 * Deprecated
 */
select.prototype.inputIsValid = function (data, required, item) {
	if (data[this.path]) {
		return (data[this.path] in this.map) ? true : false;
	} else {
		return (!required || (!(this.path in data) && item && item.get(this.path))) ? true : false;
	}
};

/**
 * Formats the field value
 */
select.prototype.format = function (item) {
	return this.labels[item.get(this.path)] || '';
};

/* Export Field Type */
module.exports = select;
