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
	this._format = true;
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
	return item.get(this.path) ? moment(item.get(this.path)).format(format || 'YYYY-MM-DD hh:mm a') : ''
}

/**
 * Checks that a valid date has been provided in a data object
 * 
 * @api public
 */
datetime.prototype.validateInput = function(data) {
	if (data[this.path])
		return moment(data[this.path]).isValid();
	else
		return false;
}

/**
 * Updates the value for this field in the item from a data object
 * 
 * @api public
 */
datetime.prototype.updateItem = function(item, data) {
	
	if (!(item.path in data))
		return;
	
	var newValue = moment(data[this.path]);
	
	if (newValue && newValue.isValid()) {
		if (!newValue.isSame(item.get(field.path)))
			item.set(this.path, newValue.toDate());
	} else if (item.get(this.path)) {
		item.set(this.path, null);
	}
	
}

exports = module.exports = datetime;
