var _ = require('underscore');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');

/**
 * Select FieldType Constructor
 * @extends Field
 * @api public
 */
function select(list, path, options) {
	this.ui = options.ui || 'select';
	this.numeric = options.numeric ? true : false;
	this._nativeType = (options.numeric) ? Number : String;
	this._underscoreMethods = ['format'];
	this._properties = ['ops', 'numeric'];
	if (typeof options.options === 'string') {
		options.options = options.options.split(',');
	}
	if (!Array.isArray(options.options)) {
		throw new Error('Select fields require an options array.');
	}
	this.ops = options.options.map(function(i) {
		var op = _.isString(i) ? { value: i.trim(), label: utils.keyToLabel(i) } : i;
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
	this.emptyOption = options.emptyOption ? true : false;
	// cached maps for options, labels and values
	this.map = utils.optionsMap(this.ops);
	this.labels = utils.optionsMap(this.ops, 'label');
	this.values = _.pluck(this.ops, 'value');
	select.super_.call(this, list, path, options);
}
util.inherits(select, FieldType);

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * Adds a virtual for accessing the label of the selected value,
 * and statics to the Schema for converting a value to a label,
 * and retrieving all of the defined options.
 */
select.prototype.addToSchema = function() {
	var field = this;
	var schema = this.list.schema;
	this.paths = {
		data: this.options.dataPath || this._path.append('Data'),
		label: this.options.labelPath || this._path.append('Label'),
		options: this.options.optionsPath || this._path.append('Options'),
		map: this.options.optionsMapPath || this._path.append('OptionsMap')
	};
	schema.path(this.path, _.defaults({
		type: this._nativeType,
		enum: this.values,
		set: function(val) {
			return (val === '' || val === null || val === false) ? undefined : val;
		}
	}, this.options));
	schema.virtual(this.paths.data).get(function () {
		return field.map[this.get(field.path)];
	});
	schema.virtual(this.paths.label).get(function () {
		return field.labels[this.get(field.path)];
	});
	schema.virtual(this.paths.options).get(function() {
		return field.ops;
	});
	schema.virtual(this.paths.map).get(function() {
		return field.map;
	});
	this.underscoreMethod('pluck', function(property, d) {
		var option = this.get(field.paths.data);
		return (option) ? option[property] : d;
	});
	this.bindUnderscoreMethods();
};

/**
 * Retrieves a shallow clone of the options array
 */
select.prototype.cloneOps = function() {
	return _.map(this.ops, _.clone);
};

/**
 * Retrieves a shallow clone of the options map
 */
select.prototype.cloneMap = function() {
	return utils.optionsMap(this.ops, true);
};

/**
 * Add filters to a query
 */
select.prototype.addFilterToQuery = function(filter, query) {
	query = query || {};
	if (filter.value) {
		query[this.path] = (filter.invert) ? { $ne: filter.value } : filter.value;
	} else {
		query[this.path] = (filter.inverse) ? { $nin: ['', null] } : { $in: ['', null] };
	}
	return query;
};

/**
 * Validates that a valid option has been provided in a data object
 */
select.prototype.validateInput = function(data, required, item) {
	if (data[this.path]) {
		return (data[this.path] in this.map) ? true : false;
	} else {
		return (!required || (!(this.path in data) && item && item.get(this.path))) ? true : false;
	}
};

/**
 * Formats the field value
 */
select.prototype.format = function(item) {
	return this.labels[item.get(this.path)];
};

/* Export Field Type */
exports = module.exports = select;
