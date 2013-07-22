/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	util = require('util'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * Name FieldType Constructor
 * @extends Field
 * @api public
 */

function name(list, path, options) {
	name.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(name, super_);

/**
 * Registers the field on the List's Mongoose Schema.
 * 
 * Adds String properties for .first and .last name, and a virtual
 * with get() and set() methods for .full
 * 
 * @api public
 */
name.prototype.addToSchema = function() {
	
	var schema = this.list.schema;
	
	var paths = this.paths = {
		first: this._path.append('.first'),
		last: this._path.append('.last'),
		full: this._path.append('.full')
	};
	
	schema.nested[this.path] = true;
	schema.add({
		first: String,
		last: String
	}, this.path + '.');
	
	schema.virtual(paths.full).get(function () {
		return _.compact([this.get(paths.first), this.get(paths.last)]).join(' ');
	});

	schema.virtual(paths.full).set(function(value) {
		
		if (typeof value != 'string') {
			this.set(paths.first, undefined);
			this.set(paths.last, undefined);
			return;
		}
		
		var split = value.split(' ');
		this.set(paths.first, split.shift());
		this.set(paths.last, split.join(' ') || undefined);
		
	});
}

/**
 * Formats the field value
 * 
 * @api public
 */
name.prototype.format = function(item) {
	return item.get(this.paths.full);
}

/**
 * Validates that a value for this field has been provided in a data object
 * 
 * @api public
 */
name.prototype.validateInput = function(data) {
	return (data[this.paths.full] || data[this.paths.first] || data[this.paths.last]) ? true : false;
}

/**
 * Updates the value for this field in the item from a data object
 * 
 * @api public
 */
name.prototype.updateItem = function(item, data) {
	if (this.paths.full in data)
		item.set(this.paths.full, data[this.paths.full]);
	if (this.paths.first in data)
		item.set(this.paths.first, data[this.paths.first]);
	if (this.paths.last in data)
		item.set(this.paths.last, data[this.paths.last]);
}

exports = module.exports = name;
