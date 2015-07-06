/*!
 * Module dependencies.
 */

var util = require('util'),
	numeral = require('numeral'),
	utils = require('keystone-utils'),
	super_ = require('../Type');

/**
 * Money FieldType Constructor
 * @extends Field
 * @api public
 */

function money(list, path, options) {
	
	this.currency = options.currency;
	
	this._nativeType = Number;
	this._underscoreMethods = ['format'];
	this._properties = ['currency'];
	this._fixedSize = 'small';
	this._formatString = (options.format === false) ? false : (options.format || '$0,0.00');
	
	if (this._formatString && 'string' !== typeof this._formatString) {
		throw new Error('FieldType.Money: options.format must be a string.');
	}
	
	money.super_.call(this, list, path, options);
	
}

/*!
 * Inherit from Field
 */

util.inherits(money, super_);


/**
 * Formats the field value
 *
 * @api public
 */

money.prototype.format = function(item, format) {
	if (this.currency) {
		try {
			numeral.language(this.currency, require('numeral/languages/' + this.currency));
			numeral.language(this.currency);
		} catch (err) {
			throw new Error('FieldType.Money: options.currency failed to load.');
		}
	}
	if (format || this._formatString) {
		return ('number' === typeof item.get(this.path)) ? numeral(item.get(this.path)).format(format || this._formatString) : '';
	} else {
		return item.get(this.path) || '';
	}
};


/**
 * Checks that a valid number has been provided in a data object
 *
 * An empty value clears the stored value and is considered valid
 *
 * @api public
 */

money.prototype.validateInput = function(data, required, item) {
	
	var value = this.getValueFromData(data);
	
	if (value === undefined && item && (item.get(this.path) || item.get(this.path) === 0)) {
		return true;
	}
	
	if (value !== undefined && value !== '') {
		var newValue = utils.number(value);
		return (!isNaN(newValue));
	} else {
		return (required) ? false : true;
	}
	
};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

money.prototype.updateItem = function(item, data) {
	
	var value = this.getValueFromData(data);
	
	if (value === undefined) {
		return;
	}
	
	var newValue = utils.number(value);
	
	if (!isNaN(newValue)) {
		if (newValue !== item.get(this.path)) {
			item.set(this.path, newValue);
		}
	} else if ('number' === typeof item.get(this.path)) {
		item.set(this.path, null);
	}
	
};


/*!
 * Export class
 */

exports = module.exports = money;
