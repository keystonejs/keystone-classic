/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	utils = require('keystone-utils'),
	Path = require('./path');


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
	this._path = new Path(path);
	this.path = path;
	
	this.type = this.constructor.name;
	this.options = utils.options(this.defaults, options);
	this.label = options.label || utils.keyToLabel(this.path);
	this.typeDescription = options.typeDescription || this.typeDescription || this.type;
	
	this.list.automap(this);
	this.addToSchema();
	
}

exports = module.exports = Field;


/** Getter properties for the Field prototype */

Object.defineProperty(Field.prototype, 'width', { get: function() { return this.options.width || 'full' } }); // note: field width is, for certain types, overridden by css
Object.defineProperty(Field.prototype, 'note', { get: function() { return this.options.note || '' } });
Object.defineProperty(Field.prototype, 'initial', { get: function() { return this.options.initial || false } });
Object.defineProperty(Field.prototype, 'required', { get: function() { return this.options.required || false } });
Object.defineProperty(Field.prototype, 'col', { get: function() { return this.options.col || false } });
Object.defineProperty(Field.prototype, 'noedit', { get: function() { return this.options.noedit || false } });
Object.defineProperty(Field.prototype, 'nocol', { get: function() { return this.options.nocol || false } });
Object.defineProperty(Field.prototype, 'nosort', { get: function() { return this.options.nosort || false } });
Object.defineProperty(Field.prototype, 'nofilter', { get: function() { return this.options.nofilter || false } });
Object.defineProperty(Field.prototype, 'collapse', { get: function() { return this.options.collapse || false } });
Object.defineProperty(Field.prototype, 'hidden', { get: function() { return this.options.hidden || false } });
Object.defineProperty(Field.prototype, 'dependsOn', { get: function() { return this.options.dependsOn || false } });


/**
 * Default method to register the field on the List's Mongoose Schema.
 * Overridden by some fieldType Classes
 * 
 * @api public
 */

Field.prototype.addToSchema = function() {
	
	var ops = (this._nativeType) ? _.defaults({ type: this._nativeType }, this.options) : this.options;
	
	this.list.schema.path(this.path, ops);
	
	this.bindUnderscoreMethods();
	
}

Field.prototype.bindUnderscoreMethods = function(methods) {
	
	var field = this;
	
	// automatically bind underscore methods specified by the _underscoreMethods property
	// always include the 'update' method
	
	(this._underscoreMethods || []).concat({ fn: 'updateItem', as: 'update' }, (methods || [])).forEach(function(method) {
		if ('string' == typeof method) {
			method = { fn: method, as: method };
		}
		if ('function' != typeof field[method.fn]) {
			throw new Error('Invalid underscore method (' + method.fn + ') applied to ' + field.path + ' (' + field.type + ')');
		}
		field.underscoreMethod(method.as, function() {
			var args = [this].concat(Array.prototype.slice.call(arguments));
			return field[method.fn].apply(field, args);
		});
	});
	
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

Field.prototype.validateInput = function(data, required, item) {
	if (!required) return true;
	if (!(this.path in data) && item && item.get(this.path)) return true;
	if ('string' == typeof data[this.path]) {
		return (data[this.path].trim()) ? true : false;
	} else {
		return (data[this.path]) ? true : false;
	}
}


/**
 * Updates the value for this field in the item from a data object
 * Overridden by some fieldType Classes
 * 
 * @api public
 */

Field.prototype.updateItem = function(item, data) {
	if (this.path in data && data[this.path] != item.get(this.path)) {
		item.set(this.path, data[this.path]);
	}
}
