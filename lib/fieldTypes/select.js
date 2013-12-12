/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	util = require('util'),
	utils = require('keystone-utils'),
	super_ = require('../field');

/**
 * Select FieldType Constructor
 * @extends Field
 * @api public
 */

function select(list, path, options) {
	
	this._nativeType = (options.numeric) ? Number : String;
	this._underscoreMethods = ['format'];
	
	this.ui = options.ui || 'select';
	
	if (typeof options.options == 'string')
		options.options = options.options.split(',');
	
	if (!Array.isArray(options.options))
		throw new Error("Select fields require an options array.");
	
	this.ops = options.options.map(function(i) {
		return ('string' == typeof i) ? { value: i.trim(), label: utils.keyToLabel(i) } : i;
	});
	
	// if it's a numeric field, ensure all provided values are numbers
	if (options.numeric) {
		for (var i in this.ops) {
			i.value = Number(i.value);
		}
	}
	
	this.map = utils.optionsMap(this.ops);
	this.labels = utils.optionsMap(this.ops, 'label');
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
		data: this.options.dataPath || this._path.append('Data'),
		label: this.options.labelPath || this._path.append('Label'),
		options: this.options.optionsPath || this._path.append('Options'),
		map: this.options.optionsMapPath || this._path.append('OptionsMap')
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
	
}


/**
 * Retrieves a shallow clone of the options array
 * 
 * @api public
 */

select.prototype.cloneOps = function() {
	return _.map(this.ops, _.clone);
}


/**
 * Retrieves a shallow clone of the options map
 * 
 * @api public
 */

select.prototype.cloneMap = function() {
	return utils.optionsMap(this.ops, true);
}


/**
 * Validates that a valid option has been provided in a data object
 * 
 * @api public
 */

select.prototype.validateInput = function(data, required, item) {
	
	if (data[this.path]) {
		return (data[this.path] in this.map) ? true : false;
	} else {
		return (!required || (!(this.path in data) && item && item.get(this.path))) ? true : false;
	}
	
}


/**
 * Formats the field value
 * 
 * @api public
 */

select.prototype.format = function(item) {
	return this.labels[item.get(this.path)];
}


/*!
 * Export class
 */

exports = module.exports = select;
