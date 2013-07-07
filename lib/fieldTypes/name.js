/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('../utils'),
	Field = require('../field');

/**
 * Name FieldType Constructor
 * @extends Field
 * @api public
 */

function Name(list, path, options) {
	Name.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(Name, Field);

Name.prototype.addToSchema = function() {
	
	var schema = this.list.schema;
	
	var _first = this.path.append('.first'),
		_last = this.path.append('.last'),
		_full = this.path.append('.full');
	
	schema.path(_first, { type: String });
	schema.path(_last, { type: String });
	
	schema.virtual(_full).get(function () {
		return _.compact([this.get(_first), this.get(_last)]).join(' ');
	});

	schema.virtual(_full).set(function(name) {
		
		if (typeof name != 'string') {
			this.set(_first, undefined);
			this.set(_last, undefined);
			return;
		}
		
		var split = name.split(' ');
		this.set(_first, split.shift());
		this.set(_last, split.join(' ') || undefined);
		
	});
}

exports = module.exports = Name;
