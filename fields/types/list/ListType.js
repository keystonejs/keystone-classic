var async = require('async');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');

var isReserved = require('../../../lib/list/isReserved');

/**
 * List FieldType Constructor
 * @extends Field
 * @api public
 */
function list (keystoneList, path, options) {
	this._underscoreMethods = ['format'];
	list.super_.call(this, keystoneList, path, options);
}
list.properName = 'List';
util.inherits(list, FieldType);

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
			throw new Error(
				'Unrecognised field constructor for nested schema path `' + path
				+ '` in `' + field.list.key + '.' + field.path + '`: ' + type
			);
		}
	}
	return type;
}

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */
list.prototype.addToSchema = function (schema) {
	var field = this;
	var mongoose = this.list.keystone.mongoose;

	var fields = this.fields = {};
	var fieldsArray = this.fieldsArray = [];
	var fieldsSpec = this.options.fields;
	var itemSchema = new mongoose.Schema();

	if (typeof fieldsSpec !== 'object' || !Object.keys(fieldsSpec).length) {
		throw new Error(
			'List field ' + field.list.key + '.' + field.path
			+ ' must be configured with `fields`.'
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
				'Invalid type for nested schema path `' + path + '` in `'
				+ field.list.key + '.' + field.path + '`.\n'
				+ 'Did you misspell the field type?\n'
			);
		}
		options.type = validateFieldType(field, path, options.type);
		// We need to tell the Keystone List that this field type is in use
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
				'Invalid value for nested schema path `' + path + '` in `'
				+ field.list.key + '.' + field.path + '`.\n'
				+ 'Did you misspell the field type?\n'
			);
		}
		if (isReserved(path)) {
			throw new Error(
				'Nested schema path ' + path + ' on field '
				+ field.list.key + '.' + field.path + ' is a reserved path'
			);
		}
		var newField = createField(path, fieldsSpec[path]);
		fields[path] = newField;
		fieldsArray.push(newField);
	});

	if (this.options.decorateSchema) {
		this.options.decorateSchema(itemSchema);
	}

	schema.add(this._path.addTo({}, [itemSchema]));
	this.bindUnderscoreMethods();
};

/**
 * Provides additional properties for the Admin UI
 */
list.prototype.getProperties = function (item, separator) {
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
list.prototype.format = function (item, separator) {
	// TODO: How should we format nested items? Returning length for now.
	var items = item.get(this.path) || [];
	return utils.plural(items.length, '* Value', '* Values');
};

// TODO: How should we filter list values?
/*
list.prototype.addFilterToQuery = function (filter) { };
*/

/**
 * Asynchronously confirms that the provided value is valid
 */
list.prototype.validateInput = function (data, callback) {
	// TODO
	// var value = this.getValueFromData(data);
	var result = true;
	utils.defer(callback, result);
};

/**
 * Asynchronously confirms that the a value is present
 */
list.prototype.validateRequiredInput = function (item, data, callback) {
	// TODO
	// var value = this.getValueFromData(data);
	var result = true;
	utils.defer(callback, result);
};

list.prototype.getData = function (item) {
	var items = item.get(this.path);
	var fieldsArray = this.fieldsArray;
	return items.map(function (i) {
		var result = { id: i.id };
		for (var field of fieldsArray) {
			result[field.path] = field.getData(i);
		}
		return result;
	});
};

/**
 * Updates the value for this field in the item from a data object.
 * If the data object does not contain the value, then the value is set to empty array.
 */
list.prototype.updateItem = function (item, data, files, callback) {
	if (typeof files === 'function') {
		callback = files;
		files = {};
	}

	var field = this;
	var values = this.getValueFromData(data);
	// Don't update the value when it is undefined
	if (values === undefined) {
		return utils.defer(callback);
	}
	// Reset the value when null or an empty string is provided
	if (values === null || values === '') {
		values = [];
	}
	// Wrap non-array values in an array
	if (!Array.isArray(values)) {
		values = [values];
	}
	// NOTE - this method will overwrite the entire array, which is less specific
	// than it could be. Concurrent saves could lead to race conditions, but we
	// can make it more clever in a future release; this is otherwise the most
	// resiliant update method that can be implemented without a lot of complexity
	var listArray = item.get(this.path);
	async.map(values, function (value, next) {
		var prevItem = listArray.id(value.id);
		var newItem = listArray.create(prevItem);
		async.forEach(field.fieldsArray, function (nestedField, done) {
			if (nestedField.updateItem.length === 4) {
				nestedField.updateItem(newItem, value, files, done);
			} else {
				nestedField.updateItem(newItem, value, done);
			}
		}, function (err) {
			next(err, newItem);
		});
	}, function (err, updatedValues) {
		if (err) return callback(err);
		item.set(field.path, updatedValues);
		callback();
	});
};

/* Export Field Type */
module.exports = list;
