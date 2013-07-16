/*!
 * Module dependencies.
 */

var util = require('util'),
	moment = require('moment'),
	utils = require('../utils'),
	super_ = require('../field');

/**
 * DateTime FieldType Constructor
 * @extends Field
 * @api public
 */

function datetime(list, path, options) {
	this._nativeType = Date;
	datetime.super_.call(this, list, path, options);
};

/*!
 * Inherit from Field
 */
 
util.inherits(datetime, super_);


/**
 * Formats the field value
 * 
 * @api public
 */
datetime.prototype.format = function(item, format) {
	return moment(item.get(this.path)).format('YYYY-MM-DD HH:SS');
}


/**
 * Updates the value for this field in the item from a data object
 * 
 * @api public
 */
datetime.prototype.updateItem = function(item, data) {
	if (this.path in data && data[this.path]) {
		var newValue = moment(data[this.path]);
		if (newValue.isValid)
			item.set(this.path, newValue.toDate());
	}
	
}

exports = module.exports = datetime;
