/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	keystone = require('../../'),
	util = require('util'),
	utils = require('keystone-utils'),
	super_ = require('../field');

/**
 * Relationship FieldType Constructor
 * @extends Field
 * @api public
 */

function relationship(list, path, options) {

	this.many = (options.many) ? true : false;
	this.filters = options.filters;
	this._nativeType = keystone.mongoose.Schema.Types.ObjectId;
	this._underscoreMethods = ['format'];

	relationship.super_.call(this, list, path, options);

}

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
		return keystone.list(field.options.ref);
	});

	if (this.many) {
		this.underscoreMethod('contains', function(find) {
			var value = this.populated(field.path) || this.get(field.path);
			if ('object' === typeof find) {
				find = find.id;
			}
			var result = _.some(value, function(value) {
				return (value + '' === find);
			});
			return result;
		});
	}

	this.bindUnderscoreMethods();

};

/**
 * Formats the field value
 *
 * @api public
 */
relationship.prototype.format = function(item) {
	var value = item.get(this.path);
	// force the formatted value to be a - unexpected things happen with ObjectIds.
	return this.many ? value.join(', ') : (value || '') + '';
};


/**
 * Validates that a value for this field has been provided in a data object
 *
 * @api public
 */

relationship.prototype.validateInput = function(data, required, item) {

	if (!required) return true;
	if (!(this.path in data) && item && ((this.many && item.get(this.path).length) || item.get(this.path))) return true;

	if ('string' === typeof data[this.path]) {
		return (data[this.path].trim()) ? true : false;
	} else {
		return (data[this.path]) ? true : false;
	}

};


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

	if (item.populated(this.path)) {
		throw new Error('fieldTypes.relationship.updateItem() Error - You cannot update populated relationships.');
	}

	if (this.many) {

		var arr = item.get(this.path),
			_old = arr.map(function(i) { return String(i); }),
			_new = data[this.path];

		if (!utils.isArray(_new)) {
			_new = String(_new || '').split(',');
		}

		_new = _.compact(_new);

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
			if (data[this.path] !== item.get(this.path)) {
				item.set(this.path, data[this.path]);
			}
		} else if (item.get(this.path)) {
			item.set(this.path, null);
		}
	}

};


/**
 * Returns true if the relationship configuration is valid
 *
 * @api public
 */

Object.defineProperty(relationship.prototype, 'isValid', {
	get: function() {
		return keystone.list(this.options.ref) ? true : false;
	}
});


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
		return (this.filters && _.keys(this.filters).length);
	}
});


/**
 * Adds relationship filters to a query
 *
 * @api public
 */

relationship.prototype.addFilters = function(query, item) {

	_.each(this.filters, function(filters, path) {
		if (!utils.isObject(filters)) {
			filters = { equals: filters };
		}
		query.where(path);
		_.each(filters, function(value, method) {
			if ('string' === typeof value && value.substr(0,1) === ':') {
				if (!item) {
					return;
				}
				value = item.get(value.substr(1));
			}
			query[method](value);
		});
	});

};


/*!
 * Export class
 */

exports = module.exports = relationship;
