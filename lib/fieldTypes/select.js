/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	util = require('util'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * Select FieldType Constructor
 * @extends Field
 * @api public
 */

function select(list, path, options) {
	
	this._nativeType = (options.numeric) ? Number : String;
	this._format = true;
	
	if (typeof options.options == 'string')
		options.options = options.options.split(',');
	
	if (!Array.isArray(options.options))
		throw new Error("Select fields require an options array.");
	
	this.ops = _.map(options.options, function(i) {
		return ('string' == typeof i) ? { value: i.trim(), label: utils.toTitleCase(i.trim()) } : i;
	});
	
	// if it's a numeric field, ensure all provided values are numbers
	if (options.numeric) {
		for (var i in this.ops) {
			i.value = Number(i.value);
		}
	}
	
	this.map = utils.optionsMap(this.ops);
	this.values = _.pluck(this.ops, 'value');
	
	select.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(select, super_);

/**
 * Registers the field on the List's Mongoose Schema.
 * 
 * Adds a virtual for accessing the label of the selected value,
 * and statics to the Schema for converting a value to a label,
 * and retrieving all of the defined options.
 * 
 * @api public
 */

select.prototype.addToSchema = function() {
	
	var field = this,
		schema = this.list.schema;
	
	this.paths = {
		label: this.options.labelPath || this._path.append('Label'),
		getOptions: 'get' + this._path.flatten(true) + 'Options',
		getLabel: 'get' + this._path.flatten(true) + 'Label',
	};
	
	schema.path(this.path, _.defaults({
		type: this._nativeType,
		enum: this.values,
		set: function(val) {
			if (val == '')
				return undefined;
			return val;
		}
	}, this.options));
	
	schema.virtual(this.paths.label).get(function () {
		return field.map[this.get(field.path)];
	});
	
	schema.statics[this.paths.getOptions] = function() {
		return field.ops;
	}
	
	schema.statics[this.paths.getLabel] = function(val) {
		var match = _.find(field.ops, function(i) { return i.value == val });
		return (match) ? match.label : undefined;
	}
	
}


/**
 * Validates that a valid option has been provided in a data object
 * 
 * @api public
 */

select.prototype.validateInput = function(data) {
	return (data[this.path] in item.map) ? true : false;
}


/**
 * Formats the field value
 * 
 * @api public
 */

select.prototype.format = function(item) {
	return this.map[item.get(this.path)];
}

exports = module.exports = select;


