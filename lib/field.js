/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	utils = require('./utils');


/**
 * Field Constructor
 * =================
 * 
 * Extended by fieldType Classes, should not be used directly.
 * 
 * @api public
 */

function Field(list, path, options) {
	
	this.list = list;
	this._path = new utils.Path(path);
	this.path = path;
	
	this.options = utils.options(this.defaults, options);
	
	this.label = options.label || utils.keyToLabel(this.path);
	this.width = options.width || 'full'; // note: field width is, for certain types, overridden by css
	this.note = options.note || '';
	this.initial = options.initial;
	this.required = options.required;
	this.noedit = options.noedit;
	
	this.list.automap(this);
	
	this.type = this.constructor.name;
	
	this.addToSchema();
	
}

exports = module.exports = Field;


/**
 * Default method to register the field on the List's Mongoose Schema.
 * Overridden by some fieldType Classes
 * 
 * @api public
 */

Field.prototype.addToSchema = function() {
	
	var field = this,
		ops = (this._nativeType) ? _.defaults({ type: this._nativeType }, this.options) : this.options;
	
	this.list.schema.path(this.path, ops);
	
	// if the _format property of this field type is true, automatically add
	// an underscoreMethod for the .format() method on the field
	
	if (this._format) {
		this.underscoreMethod('format', function() {
			var args = [this].concat(Array.prototype.slice.call(arguments));
			return field.format.apply(field, args);
		});
	}
	
}


/**
 * Adds a method to the underscoreMethods collection on the field's list,
 * with a path prefix to match this field's path and bound to the document
 * 
 * @api public
 */

Field.prototype.underscoreMethod = function(path, fn) {
	this.list.underscoreMethod(this.path + '.' + path, function() {
		return fn.apply(this, arguments);
	});
}


/**
 * Default method to format the field value for display
 * Overridden by some fieldType Classes
 * 
 * @api public
 */

Field.prototype.format = function(item) {
	return item.get(this.path);
}


/**
 * Default method to detect whether the field has been modified in an item
 * Overridden by some fieldType Classes
 * 
 * @api public
 */

Field.prototype.isModified = function(item) {
	return item.isModified(this.path);
}


/**
 * Validates that a value for this field has been provided in a data object
 * Overridden by some fieldType Classes
 * 
 * @api public
 */

Field.prototype.validateInput = function(data) {
	return (data[this.path]) ? true : false;
}


/**
 * Updates the value for this field in the item from a data object
 * Overridden by some fieldType Classes
 * 
 * @api public
 */

Field.prototype.updateItem = function(item, data) {
	if (this.path in data && data[this.path] != item.get(this.path))
		item.set(this.path, data[this.path]);
}
