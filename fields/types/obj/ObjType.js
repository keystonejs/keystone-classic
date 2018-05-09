var async = require('async');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');
var isReserved = require('../../../lib/list/isReserved');
var q = require('q');
var _ = require('lodash');

/**
 * Obj FieldType Constructor
 * @extends Field
 * @api public
 */
function obj (keystoneObj, path, options) {
	this._underscoreMethods = ['format'];
	obj.super_.call(this, keystoneObj, path, options);
}
obj.properName = 'Obj';
util.inherits(obj, FieldType);

function validateFieldType (field, path, type) {
	var Field = field.list.keystone.Field;
	if (!(type.prototype instanceof Field)) {
		// Convert native field types to their default Keystone counterpart
		if (type === String) {
			type = Field.Types.Text;
		} else if (type === Number) {
			type = Field.Types.Number;
		} else if (type === Boolean) {
			type = Field.Types.Boolean;
		} else if (type === Date) {
			type = Field.Types.Datetime;
		} else {
			throw new Error('Unrecognised field constructor for nested schema path `' + path + '` in `' + field.list.key + '.' + field.path + '`: ' + type);
		}
	}
	return type;
}

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */
obj.prototype.addToSchema = function (schema) {

	var field = this;
	var mongoose = this.list.keystone.mongoose;

	var fields = this.fields = {};
	var fieldsArray = this.fieldsArray = [];
	var fieldsSpec = this.options.fields;
	var itemSchema = new mongoose.Schema();

	if (typeof fieldsSpec !== 'object' || !Object.keys(fieldsSpec).length) {
		throw new Error(
			'Obj field ' + field.list.key + '.' + field.path + ' must be configured with `fields`.'
		);
	}

	function createField (path, options) {
		if (typeof options === 'function') {
			options = { type: options };
		}
		if (field.list.get('noedit') || field.noedit) {
			options.noedit = true;
		}
		if (typeof options.type !== 'function') {
			throw new Error(
				'Invalid type for nested schema path `' + path + '` in `' + field.list.key + '.' + field.path + '`.\n' + 'Did you misspell the field type?\n'
			);
		}
		options.type = validateFieldType(field, path, options.type);
		// We need to tell the Keystone Obj that this field type is in use
		field.list.fieldTypes[options.type.name] = options.type.properName;
		// WYSIWYG HTML fields are special-cased
		if (options.type.name === 'html' && options.wysiwyg) {
			field.list.fieldTypes.wysiwyg = true;
		}
		// Tell the Field that it is nested, this changes the constructor slightly
		options._isNested = true;
		options._nestedSchema = itemSchema;
		return new options.type(field.list, path, options);
	}

	Object.keys(fieldsSpec).forEach(function (path) {
		if (!fieldsSpec[path]) {
			throw new Error(
				'Invalid value for nested schema path `' + path + '` in `' + field.list.key + '.' + field.path + '`.\n' + 'Did you misspell the field type?\n'
			);
		}
		if (isReserved(path)) {
			throw new Error(
				'Nested schema path ' + path + ' on field ' + field.list.key + '.' + field.path + ' is a reserved path'
			);
		}
		var newField = createField(path, fieldsSpec[path]);
		fields[field.path + '.' + path] = newField;
		fieldsArray.push(newField);
	});

	schema.add(this._path.addTo({}, itemSchema));

	field.paths = {};
	fieldsArray.forEach(function (f) { field.paths[f.path] = field.path + '.' + f.path; });

	field.paths['serialised'] = this.path + '.serialised';
	field.paths['improve'] = this.path + '_improve';
	field.paths['overwrite'] = this.path + '_improve_overwrite';

	schema.virtual(field.paths.serialised).get(function () {
		var _this = this;
		return _.compact(fieldsArray.map(function (f) { return _this.get(field.paths[f.path]); })).join(', ');
	});

	this.bindUnderscoreMethods();
};

/**
 * Provides additional properties for the Admin UI
 */
obj.prototype.getProperties = function (item, separator) {
	var fields = {};
	this.fieldsArray.forEach(function (field) {
		fields[field.path] = field.getOptions();
	});
	return {
		fields: fields,
	};
};

/**
 * Formats the field value
 */
obj.prototype.format = function (item, separator) {
	// TODO: How should we format nested items? Returning length for now.
	var items = item.get(this.path) || [];
	return utils.plural(items.length, '* Value', '* Values');
};

// TODO: How should we filter obj values?
/*
obj.prototype.addFilterToQuery = function (filter) { };
*/

/**
 * Asynchronously confirms that the provided value is valid
 */
obj.prototype.validateInput = function (data, callback) {
	
	var result = true;
	utils.defer(callback, result);

	// var field = this;
	// var value = this.getValueFromData(data);
	// var fieldsToValidate = [];
	// var result = true;

	// if (!!value) {
	// 	field.fieldsArray.forEach(function (f) {
	// 		var deferred = q.defer();
	// 		fieldsToValidate.push(deferred.promise);
	// 		f.validateInput(value, function (result) {
	// 			deferred.resolve(result);
	// 		});
	// 	});
	// }

	// q.allSettled(fieldsToValidate)
	// 	.then(function (results) {
	// 		var valid = !_.filter(results, function (result) { return !result.value; }).length;
	// 		utils.defer(callback, valid);
	// 	});
};

/**
 * Asynchronously confirms that the a value is present
 */
obj.prototype.validateRequiredInput = function (item, data, callback) {
	// TODO
	// var value = this.getValueFromData(data);
	var result = true;
	utils.defer(callback, result);
};

obj.prototype.getData = function (item) {
	var fieldsArray = this.fieldsArray;
	var result = {};
	if (!!item[this.path]) {
		for (var field of fieldsArray) {
			result[field.path] = field.getData(item[this.path]);
		}
	}
	return result;
};

/**
 * Updates the value for this field in the item from a data object.
 * If the data object does not contain the value, then the value is set to empty array.
 */

obj.prototype.updateItem = function (item, data, files, callback) {

	if (typeof files === 'function') {
		callback = files;
		files = {};
	}

	var field = this;

	// Recursively get nested fields
	var value = getDataFromObject(data, field);
	item.set(field.path, value);

	callback();
};

function getDataFromObject(data, field) {

	let fullObject = {};

	if (field.fieldsArray) {
		field.fieldsArray.forEach(function (nestedField) {
			if (nestedField.fieldsArray) {
				fullObject[nestedField.path] = getDataFromObject(data, nestedField)
			} else {
				fullObject[nestedField.path] = nestedField.getValueFromData(data[field.path] || data);
			}
		})
	} else {
		fullObject[field.path] = field.getValueFromData(data[nestedField.path] || data);
	}

	return fullObject;
}

/* Export Field Type */
module.exports = obj;
