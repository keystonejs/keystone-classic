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
	var subListName = '_' + this.list.key.toLowerCase() + '.' + this.path;
	var sublist = this.subList = new keystone.List(subListName, { schema: '', hidden: true });

	sublist.add(this.options.fields);
	sublist.register();

	this.list.schema.path(this.path, [sublist.schema]);
	this.bindUnderscoreMethods();
};

/*!
 * Export class
 */

module.exports = objectarray;
