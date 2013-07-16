/*!
 * Module dependencies.
 */

var util = require('util'),
	moment = require('moment'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * Date FieldType Constructor
 * @extends Field
 * @api public
 */

function date(list, path, options) {
	this._nativeType = Date;
	date.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(date, super_);


/**
 * Formats the field value
 * 
 * @api public
 */
date.prototype.format = function(item, format) {
	return moment(item.get(this.path)).format(format || 'YYYY-MM-DD');
}


/**
 * Updates the value for this field in the item from a data object
 * 
 * @api public
 */
date.prototype.updateItem = function(item, data) {
	if (this.path in data) {
		var newValue = moment(data[this.path]);
		if (newValue.isValid)
			item.set(this.path, newValue.toDate());
	}
	
}

exports = module.exports = date;
