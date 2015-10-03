/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	util = require('util'),
	super_ = require('../Type');
	
var REGEXP_LNGLAT = /^\s*(\-?\d+(?:\.\d+)?)\s*\,\s*(\-?\d+(?:\.\d+)?)\s*$/;

/**
 * Geo FieldType Constructor
 * @extends Field
 * @api public
 */

function geopoint(list, path, options) {
	
	this._fixedSize = 'medium';
	
	// TODO: implement filtering, hard-coded as disabled for now
	options.nofilter = true;
	geopoint.super_.call(this, list, path, options);
	
}

/*!
 * Inherit from Field
 */

util.inherits(geopoint, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 *
 * Adds a 2dsphere indexed lat/lng pair
 *
 * @api public
 */

geopoint.prototype.addToSchema = function() {
	this.list.schema.path(this.path, _.defaults({ type: [Number], index: '2dsphere' }, this.options));
	this.bindUnderscoreMethods();
};


/**
 * Gets the field's data from an Item, as used by the React components
 */

geopoint.prototype.getData = function(item) {
	var points = item.get(this.path);
	return (points && points.length === 2) ? points : [];
};


/**
 * Formats the field value
 *
 * @api public
 */

geopoint.prototype.format = function(item) {
	if (item.get(this.path)) {
		return item.get(this.path).reverse().join(', ');	
	}
	return null;
};


/**
 * Validates that a value for this field has been provided in a data object
 *
 * @api public
 */

geopoint.prototype.validateInput = function(data, required, item) {//eslint-disable-line no-unused-vars
	
	var values = this.getValueFromData(data);

	// Input is valid if the field is not required, and not present
	if (values === undefined && !required) return true;
	
	if (_.isArray(values)) {
		values = _.compact(values).join(',');
	}
	
	if (values === '' && !required) return true;
	
	return REGEXP_LNGLAT.test(values);

};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

geopoint.prototype.updateItem = function(item, data) {
	
	if (!_.isObject(data)) return;
	
	var value = this.getValueFromData(data);
	if (value === undefined) return;

	if (_.isString(value)) {
		
		// Value should be formatted lng,lat
		var values = REGEXP_LNGLAT.exec(value);
		
		if (values) {
			item.set(this.path, [values[1], values[2]]);
		} else {
			item.set(this.path, undefined);
		}
		
	} else if (_.isArray(value)) {
		
		if (value.length === 2 && REGEXP_LNGLAT.test(_.compact(value).join(','))) {
			item.set(this.path, value);
		} else {
			item.set(this.path, undefined);
		}
		
	}

};


/*!
 * Export class
 */

exports = module.exports = geopoint;
