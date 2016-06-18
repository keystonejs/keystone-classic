var assign = require('object-assign');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');

/**
 * File FieldType Constructor
 */
function file (list, path, options) {
	this._underscoreMethods = ['format', 'upload', 'remove', 'reset'];
	this._fixedSize = 'full';

	if (!options.storage) {
		throw new Error('Invalid Configuration\n\n'
			+ 'File fields (' + list.key + '.' + path + ') require storage to be provided.');
	}
	this.storage = options.storage;
	file.super_.call(this, list, path, options);
}
file.properName = 'File';
util.inherits(file, FieldType);

/**
 * Registers the field on the List's Mongoose Schema.
 */
file.prototype.addToSchema = function () {

	var field = this;
	var schema = this.list.schema;

	this.paths = {};
	// add field paths from the storage schema
	Object.keys(this.storage.schema).forEach(function (path) {
		field.paths[path] = field._path.append('.' + path);
	});
	assign(this.paths, {
		// modifiers
		upload: this._path.append('_upload'),
		action: this._path.append('_action'), // 'delete'
	});

	var schemaPaths = this._path.addTo({}, this.storage.schema);
	schema.add(schemaPaths);

	this.bindUnderscoreMethods();
};

/**
 * Uploads a new file
 */
file.prototype.upload = function (item, file, callback) {
	var field = this;
	this.storage.uploadFile(file, function (err, result) {
		if (err) return callback(err);
		console.log('Uploaded File; Setting ' + field.path + ' to value:', result);
		item.set(field.path, result);
		callback(null, result);
	});
};

/**
 * Resets the field value
 */
file.prototype.reset = function (item) {
	var value = {};
	Object.keys(this.storageSchema).forEach(function (path) {
		value[path] = null;
	});
	item.set(this.path, value);
};

/**
 * Deletes the stored file and resets the field value
 */
file.prototype.remove = function (item) {
	this.storage.removeFile(item.get(this.path));
	this.reset();
};

/**
 * Formats the field value
 */
file.prototype.format = function (item) {
	var value = item.get(this.path);
	if (value) return value.filename || '';
	return '';
};

/**
 * Detects whether the field has been modified
 */
file.prototype.isModified = function (item) {
	var modified = false;
	var paths = this.paths;
	Object.keys(this.storageSchema).forEach(function (path) {
		if (item.isModified(paths[path])) modified = true;
	});
	return modified;
};


function validateInput (value) {
	// undefined values are always valid
	if (value === undefined) return true;
	// If a string is provided, assume it's a file to be uploaded or null value
	if (typeof value === 'string') return true;
	// If the value is an object with a path, it is a file to be uploaded
	if (typeof value === 'object' && value.path) return true;
	// If the value is an object with a filename property, it is a stored value
	if (typeof value === 'object' && value.filename) return true;
	return false;
}

/**
 * Validates that a value for this field has been provided in a data object
 */
file.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	utils.defer(callback, validateInput(value));
};

/**
 * Validates that input has been provided
 */
file.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	var result = (value || item.get(this.paths.filename)) ? true : false;
	utils.defer(callback, result);
};

/**
 * Updates the value for this field in the item from a data object
 */
file.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);

	// Allow field value reset
	if (value === '' || (typeof value === 'object' && !Object.keys(value).length)) {
		this.reset(item);
		return process.nextTick(callback);
	}

	if (typeof value === 'string') {
		value = { path: value };
	}
	if (value && value.path) {
		return this.upload(item, value, callback);
	}
	item.set(this.path, value);
	utils.defer(callback);
};

/* Export Field Type */
module.exports = file;
