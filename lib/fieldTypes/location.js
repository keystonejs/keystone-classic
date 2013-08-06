/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	util = require('util'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * Location FieldType Constructor
 * @extends Field
 * @api public
 */

function location(list, path, options) {
	this._format = true;
	location.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(location, super_);

/**
 * Registers the field on the List's Mongoose Schema.
 * 
 * Adds String properties for .first and .last location, and a virtual
 * with get() and set() methods for .full
 * 
 * @api public
 */
location.prototype.addToSchema = function() {
	
	var schema = this.list.schema;
	
	var paths = this.paths = {
		number: this._path.append('.number'),
		name: this._path.append('.name'),
		street1: this._path.append('.street1'),
		street2: this._path.append('.street2'),
		suburb: this._path.append('.suburb'),
		state: this._path.append('.state'),
		postcode: this._path.append('.postcode'),
		country: this._path.append('.country'),
		serialised: this._path.append('.serialised')
	};
	
	schema.nested[this.path] = true;
	schema.add({
		number: String,
		name: String,
		street1: String,
		street2: String,
		street3: String,
		suburb: String,
		state: String,
		postcode: String,
		country: String
	}, this.path + '.');

	schema.virtual(paths.serialised).get(function() {
		return _.compact([
			this.get(paths.number),
			this.get(paths.name),
			this.get(paths.street1),
			this.get(paths.street2),
			this.get(paths.suburb),
			this.get(paths.state),
			this.get(paths.postcode),
			this.get(paths.country)
		]).join(', ');
	});
	
}

/**
 * Formats the field value
 * 
 * @api public
 */
location.prototype.format = function(item) {
	return item.get(this.paths.serialised);
}

/**
 * Validates that a value for this field has been provided in a data object
 * 
 * This should probably be more flexible / robust;
 * Currently it just checks for a stree1 and suburb value.
 * 
 * @api public
 */
location.prototype.validateInput = function(data) {
	return (data[this.paths.street1] && data[this.paths.suburb]) ? true : false;
}

/**
 * Updates the value for this field in the item from a data object
 * 
 * @api public
 */
location.prototype.updateItem = function(item, data) {
	
	var paths = this.paths;
	
	var setValue = function(key) {
		if (paths[key] in data && data[paths[key]] != item.get(paths[key])) {
			item.set(paths[key], data[paths[key]]);
		}
	}
	
	_.each(['number', 'name', 'street1', 'street2', 'suburb', 'state', 'postcode', 'country'], setValue);
	
}

exports = module.exports = location;
