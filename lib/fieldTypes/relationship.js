/*!
 * Module dependencies.
 */

var util = require('util'),
	_ = require('underscore'),
	keystone = require('../../'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * Relationship FieldType Constructor
 * @extends Field
 * @api public
 */

function relationship(list, path, options) {
	this._nativeType = keystone.mongoose.Schema.Types.ObjectId;
	relationship.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(relationship, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 * 
 * @api public
 */

relationship.prototype.addToSchema = function() {
	
	var field = this,
		schema = this.list.schema;
	
	this.paths = {
		refList: this.options.refListPath || this._path.append('RefList')
	};
	
	schema.path(this.path, {
		type: this._nativeType,
		ref: this.options.ref
	});
	
	schema.virtual(this.paths.refList).get(function () {
		return keystone.list(this.options.ref);
	});
	
	schema.statics[this.paths.getLabel] = function(val) {
		var match = _.find(field.ops, function(i) { return i.value == val });
		return (match) ? match.label : undefined;
	}
	
}

/**
 * Updates the value for this field in the item from a data object.
 * Only updates the value if it has changed.
 * Treats an empty string as a null value.
 * 
 * @api public
 */
relationship.prototype.updateItem = function(item, data) {
	
	if (!(this.path in data)) {
		return;
	}
	
	if (data[this.path]) {
		if (data[this.path] != item.get(this.path)) {
			item.set(this.path, data[this.path]);
		}
	} else if (item.get(this.path)) {
		item.set(this.path, null);
	}
	
}


/**
 * Returns the Related List
 * 
 * @api public
 */

Object.defineProperty(relationship.prototype, 'refList', {
	get: function() {
		return keystone.list(this.options.ref);
	}
});


/**
 * Whether the field has any filters defined
 * 
 * @api public
 */

Object.defineProperty(relationship.prototype, 'hasFilters', {
	get: function() {
		return (this.options.filters && _.keys(this.options.filters).length);
	}
});


/**
 * Adds relationship filters to a query
 * 
 * @api public
 */
relationship.prototype.addFilters = function(query, item) {
	
	_.each(this.options.filters, function(filters, path) {
		if (!utils.isObject(filters)) {
			filters = { equals: filters };
		}
		query.where(path);
		_.each(filters, function(value, method) {
			if ('string' == typeof value && value.substr(0,1) == ':') {
				value = item.get(value.substr(1))
			}
			query[method](value);
		});
	});
	
}


exports = module.exports = relationship;
