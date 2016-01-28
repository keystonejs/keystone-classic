/*!
 * Module dependencies.
 */

var util = require('util'),
	keystone = require('../../../');
	FieldType = require('../Type');

/**
 * TextArray FieldType Constructor
 * @extends Field
 * @api public
 */

function objectarray(list, path, options) {
	objectarray.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(objectarray, FieldType);

objectarray.prototype.addToSchema = function() {
	var sublist = this.subList = new keystone.List('ProductTags', { schema: '' });

	sublist.add(this.options.fields);

	this.list.schema.path(this.path, sublist.schema);
	this.bindUnderscoreMethods();
};

/*!
 * Export class
 */

module.exports = objectarray;
