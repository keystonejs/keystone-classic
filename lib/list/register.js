var assign = require('object-assign');
var schemaPlugins = require('../schemaPlugins');
var UpdateHandler = require('../updateHandler');
var utils = require('keystone-utils');
var debug = require('debug')('keystone:core:list:register');


/**
 * Registers the Schema with Mongoose, and the List with Keystone
 *
 * Also adds default fields and virtuals to the schema for the list
 */
function register () {
	var keystone = this.keystone;
	var list = this;
	/* Handle deprecated options */
	if (this.schema.methods.toCSV) {
		console.warn(this.key + ' Warning: List.schema.methods.toCSV support has been removed from KeystoneJS.\nPlease use getCSVData instead (see the 0.3 -> 4.0 Upgrade Guide)\n');
	}
	/* Apply Plugins */
	if (this.get('sortable')) {
		schemaPlugins.sortable.apply(this);
	}
	if (this.get('autokey')) {
		schemaPlugins.autokey.apply(this);
	}
	if (this.get('track')) {
		schemaPlugins.track.apply(this);
	}
	if (this.get('history')) {
		schemaPlugins.history.apply(this);
	}
	this.schema.virtual('list').get(function () {
		return list;
	});
	/* Add common methods to the schema */
	if (Object.keys(this.relationships).length) {
		this.schema.methods.getRelated = schemaPlugins.methods.getRelated;
		this.schema.methods.populateRelated = schemaPlugins.methods.populateRelated;
		if (!this.schema.options.toObject) this.schema.options.toObject = {};
		this.schema.options.toObject.transform = schemaPlugins.options.transform;
	}
	this.schema.virtual('_').get(function () {
		if (!this.__methods) {
			this.__methods = utils.bindMethods(list.underscoreMethods, this);
		}
		return this.__methods;
	});
	this.schema.method('getUpdateHandler', function (req, res, ops) {
		return new UpdateHandler(list, this, req, res, ops);
	});
	/* Apply list inheritance */
	if (this.get('inherits')) {
		this.model = this.get('inherits').model.discriminator(this.key, this.schema);
	} else {
		this.model = keystone.mongoose.model(this.key, this.schema);
	}
	/* Setup search text index */
	if (this.options.searchUsesTextIndex && !this.declaresTextIndex()) {
		// If the list is configured to use a text index for search and the list
		// doesn't explicitly define one, create (or update) one of our own
		this.ensureTextIndex(function () {
			debug('this.ensureTextIndex() done for \'' + list.key + '\'');
		});
	}
	/* Register the list and its field types on the Keystone instance */
	keystone.lists[this.key] = this;
	keystone.paths[this.path] = this.key;
	assign(keystone.fieldTypes, this.fieldTypes);
	/* Add listeners for model events */
	// see http://mongoosejs.com/docs/api.html#model_Model
	this.model.on('index', function (err) {
		if (err) console.error('Mongoose model \'index\' event fired on \'' + list.key + '\' with error:\n', err.message, err.stack);
	});
	this.model.on('index-single-start', function (index) {
		debug('Mongoose model \'index-single-start\' event fired on \'' + list.key + '\' for index:\n', index);
	});
	this.model.on('index-single-done', function (err, index) {
		if (err) console.error('Mongoose model \'index-single-done\' event fired on \'' + list.key + '\' for index:\n', index, '\nWith error:\n', err.message, err.stack);
		else debug('Mongoose model \'index-single-done\' event fired on \'' + list.key + '\' for index:\n', index);
	});
	this.model.on('error', function (err) {
		if (err) console.error('Mongoose model \'error\' event fired on \'' + list.key + '\' with error:\n', err.message, err.stack);
	});
	return this;
}

module.exports = register;
