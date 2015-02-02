/*!
 * Module dependencies.
 */

var util = require('util'),
	utils = require('keystone-utils'),
	super_ = require('../Type');

/**
 * Table FieldType Constructor
 * @extends {Field}
 * @api public
 */

function table(list, path, options) {
	this._nativeType = (options.schema)? [options.schema] : [];
        this._properties = ['columns'];
        this.columns = options.columns || []; //@todo implement validation etc.
        table.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(table, super_);

/**
 * Updates the value for this field in the item from a data object
 * @param {Document} item
 * @param {Hash} data 
 * @api public
 */

table.prototype.updateItem = function(item, data) {
	if ( data[this.path] === undefined ) {
		item.set(this.path, []);
	} else {
		item.set(this.path, data[this.path]);
	}
};

module.exports = table;
