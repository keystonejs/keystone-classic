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
	this._format = true;
	this._update = true;
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
	return item.get(this.path) ? moment(item.get(this.path)).format(format || 'YYYY-MM-DD') : '';
}

/**
 * Checks that a valid date has been provided in a data object
 * 
 * An empty value clears the stored value and is considered valid
 * 
 * @api public
 */

date.prototype.validateInput = function(data, required) {
	
	var newValue = moment(data[this.path]);
	
	if (required && (!newValue || !newValue.isValid())) {
		return false;
	} else if (newValue && !newValue.isValid()) {
		return false;
	} else {
		return true;
	}
	
}


/**
 * Updates the value for this field in the item from a data object
 * 
 * @api public
 */

date.prototype.updateItem = function(item, data) {
	
	if (!(this.path in data))
		return;
	
	var newValue = moment(data[this.path]);
	
	if (newValue && newValue.isValid()) {
		if (!item.get(this.path) || !newValue.isSame(item.get(this.path)))
			item.set(this.path, newValue.toDate());
	} else if (item.get(this.path)) {
		item.set(this.path, null);
	}
	
}


/*!
 * Export class
 */

exports = module.exports = date;
