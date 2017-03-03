var FieldType = require('../Type');
var NumberType = require('../number/NumberType');
var numeral = require('numeral');
var util = require('util');

/**
 * Money FieldType Constructor
 * @extends Field
 * @api public
 */
function money (list, path, options) {
	this.currency = options.currency;
	this._nativeType = Number;
	this._underscoreMethods = ['format'];
	this._properties = ['currency'];
	this._fixedSize = 'small';
	this._formatString = (options.format === false) ? false : (options.format || '$0,0.00');
	if (this._formatString && typeof this._formatString !== 'string') {
		throw new Error('FieldType.Money: options.format must be a string.');
	}
	money.super_.call(this, list, path, options);
}
money.properName = 'Money';
util.inherits(money, FieldType);


money.prototype.validateInput = NumberType.prototype.validateInput;
money.prototype.validateRequiredInput = NumberType.prototype.validateRequiredInput;

/* Inherit from NumberType prototype */
money.prototype.updateItem = NumberType.prototype.updateItem;
money.prototype.inputIsValid = NumberType.prototype.inputIsValid;
money.prototype.addFilterToQuery = NumberType.prototype.addFilterToQuery;

/**
 * Formats the field value
 */
money.prototype.format = function (item, format) {
	if (this.currency) {
		try {
			numeral.language(this.currency, require('numeral/languages/' + this.currency));
			numeral.language(this.currency);
		} catch (err) {
			throw new Error('FieldType.Money: options.currency failed to load.');
		}
	}
	if (format || this._formatString) {
		return (typeof item.get(this.path) === 'number') ? numeral(item.get(this.path)).format(format || this._formatString) : '';
	} else {
		return item.get(this.path) || '';
	}
};

/* Export Field Type */
module.exports = money;
