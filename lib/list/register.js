var keystone = require('../../');
var schemaPlugins = require('../schemaPlugins');
var UpdateHandler = require('../updateHandler');
var utils = require('keystone-utils');

/**
 * Registers the Schema with Mongoose, and the List with Keystone
 *
 * Also adds default fields and virtuals to the schema for the list
 */
function register() {
	var list = this;
	this.schema.virtual('list').get(function () {
		return list;
	});
	if (Object.keys(this.relationships).length) {
		this.schema.methods.getRelated = schemaPlugins.methods.getRelated;
		this.schema.methods.populateRelated = schemaPlugins.methods.populateRelated;
		if (!this.schema.options.toObject) this.schema.options.toObject = {};
		this.schema.options.toObject.transform = schemaPlugins.options.transform;
	}
	this.schema.virtual('_').get(function() {
		if (!this.__methods) {
			this.__methods = utils.bindMethods(list.underscoreMethods, this);
		}
		return this.__methods;
	});
	this.schema.method('getUpdateHandler', function(req, res, ops) {
		return new UpdateHandler(list, this, req, res, ops);
	});
	if (this.get('inherits')) {
		this.model = this.get('inherits').model.discriminator(this.key, this.schema);
	} else {
		this.model = keystone.mongoose.model(this.key, this.schema);
	}
	keystone.list(this);
	return this;
}

module.exports = register;
