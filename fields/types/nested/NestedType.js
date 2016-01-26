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

function nested(list, path, options) {
	nested.super_.call(this, list, path, options);
}

/*!
 * Inherit from Field
 */

util.inherits(nested, FieldType);

nested.prototype.addToSchema = function() {
	var nestedSchema = this.nestedSchema = new keystone.mongoose.Schema(this.options.fields);

	this.list.schema.path(this.path, nestedSchema);

	this.bindUnderscoreMethods();
};

/*!
 * Export class
 */

module.exports = nested;
