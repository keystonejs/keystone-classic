var FieldType = require('../Type');
var NumberType = require('../number/NumberType');
var numeral = require('numeral');
var util = require('util');

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
util.inherits(money, FieldType);

/* Inherit from NumberType prototype */
money.prototype.updateItem = NumberType.prototype.updateItem;
money.prototype.validateInput = NumberType.prototype.validateInput;

/**
 * Formats the field value
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

/* Export Field Type */
exports = module.exports = money;
