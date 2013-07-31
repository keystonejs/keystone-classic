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
	this.many = (options.many);
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
	
	var def = {
		type: this._nativeType,
		ref: this.options.ref
	};
	
	schema.path(this.path, this.many ? [def] : def);
	
	schema.virtual(this.paths.refList).get(function () {
		return keystone.list(this.options.ref);
	});
	
}

/**
 * Formats the field value
 * 
 * @api public
 */
relationship.prototype.format = function(item, format) {
	var value = item.get(this.path);
	return this.many ? value.join(', ') : value;
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
	
	if (this.many) {
		
		var arr = item.get(this.path),
			_old = arr.map(function(i) { return String(i) }),
			_new = _.compact(data[this.path].split(','));
		
		// remove ids
		_.difference(_old, _new).forEach(function(val) {
			arr.pull(val);
		});
		// add new ids
		_.difference(_new, _old).forEach(function(val) {
			arr.push(val);
		});
		
	} else {
		if (data[this.path]) {
			if (data[this.path] != item.get(this.path)) {
				item.set(this.path, data[this.path]);
			}
		} else if (item.get(this.path)) {
			item.set(this.path, null);
		}
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
				if (!item) {
					return;
				}
				value = item.get(value.substr(1))
			}
			query[method](value);
		});
	});
	
}


exports = module.exports = relationship;
