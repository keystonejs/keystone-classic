/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	util = require('util'),
	super_ = require('../field');

/**
 * Name FieldType Constructor
 * @extends Field
 * @api public
 */

function name(list, path, options) {
	// TODO: implement filtering, hard-coded as disabled for now
	options.nofilter = true;
	name.super_.call(this, list, path, options);
}

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

		if (typeof value !== 'string') {
			this.set(paths.first, undefined);
			this.set(paths.last, undefined);
			return;
		}

		var split = value.split(' ');
		this.set(paths.first, split.shift());
		this.set(paths.last, split.join(' ') || undefined);

	});

	this.bindUnderscoreMethods();
};


/**
 * Formats the field value
 *
 * @api public
 */

name.prototype.format = function(item) {
	return item.get(this.paths.full);
};


/**
 * Validates that a value for this field has been provided in a data object
 *
 * @api public
 */

name.prototype.validateInput = function(data, required, item) {
	
	// Input is valid if none was provided, but the item has data
	if (!(this.path in data || this.paths.first in data || this.paths.last in data || this.paths.full in data) && item && item.get(this.paths.full)) return true;
	
	// Input is valid if the field is not required
	if (!required) return true;
	
	// Otherwise check for valid strings in the provided data, 
	// which may be nested or use flattened paths.
	
	if (_.isObject(data[this.path])) {
		return (data[this.path].full || data[this.path].first || data[this.path].last) ? true : false;
	} else {
		return (data[this.paths.full] || data[this.paths.first] || data[this.paths.last]) ? true : false;
	}

};


/**
 * Detects whether the field has been modified
 *
 * @api public
 */

name.prototype.isModified = function(item) {
	return item.isModified(this.paths.first) || item.isModified(this.paths.last);
};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

name.prototype.updateItem = function(item, data) {
	
	if (!_.isObject(data)) return;
	
	var paths = this.paths,
		setValue;
	
	if (this.path in data && _.isString(data[this.path])) {
		
		// Allow the root path as an alias to {path}.full
		
		item.set(paths.full, data[this.path]);
		
	} else if (this.path in data && _.isObject(data[this.path])) {
		
		// Allow a nested object like { path: { first: 'Jed' } }
		
		var valueObj = data[this.path];
		
		setValue = function(key) {
			if (key in valueObj && valueObj[key] !== item.get(paths[key])) {
				item.set(paths[key], valueObj[key]);
			}
		};
		
	} else {
		
		// Default to flattened paths like { 'path.first': 'Jed' }
		
		setValue = function(key) {
			if (paths[key] in data && data[paths[key]] !== item.get(paths[key])) {
				item.set(paths[key], data[paths[key]]);
			}
		};
		
	}
	
	if (setValue) {
		_.each(['full', 'first', 'last'], setValue);
	}

};


/*!
 * Export class
 */

exports = module.exports = name;
