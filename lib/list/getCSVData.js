var _ = require('lodash');
var listToArray = require('list-to-array');

/**
 * Applies option field transforms to get the CSV value for a field
 */

function transformFieldValue (field, item) {
	var transform = typeof field.options.toCSV === 'string'
		? listToArray(field.options.toCSV)
		: field.options.toCSV;

	if (typeof transform === 'function') {
		return transform.call(item, field);
	}

	if (Array.isArray(transform)) {
		var value = item.get(field.path);
		if (transform.length === 1) {
			return value[transform[0]];
		} else {
			return _.pick(value, transform);
		}
	}

	return field.format(item);
}

/**
 * Gets the data from an Item ready to be serialised to CSV for download
 */

function getCSVData (item, fields, expandRelationshipFields) {
	var data = {
		id: item.id,
	};
	if (this.autokey) {
		data[this.autokey.path] = item.get(this.autokey.path);
	}
	if (fields === undefined) {
		fields = Object.keys(this.fields);
	}
	if (fields) {
		if (typeof fields === 'string') {
			fields = listToArray(fields);
		}
		if (!Array.isArray(fields)) {
			throw new Error('List.getCSV: fields must be undefined, a string, or an array.');
		}
		fields.forEach(function (path) {
			var field = this.fields[path];
			if (field) {
				if (field.type === 'relationship' && expandRelationshipFields) {
					var expanded = field.getExpandedData(item);
					if (Array.isArray(expanded)) {
						data[path] = expanded.map(function (i) {
							return i.name ? i.name + ' (' + i.id + ')' : i.id;
						}).join(',');
					} else if (typeof expanded === 'object') {
						data[path] = expanded.name;
						data[path + 'Id'] = expanded.id;
					} else {
						data[path] = '';
					}
				} else {
					data[path] = transformFieldValue(field, item);
				}
			} else {
				data[path] = item.get(path);
			}
			if (Array.isArray(data[path])) {
				// Array values are serialised to JSON, this should be an edge-case catch
				// for data coming raw from the item; array-type fields will already have
				// been stringified by the field.format method.
				data[path] = JSON.stringify(data[path]);
			} else if (typeof data[path] === 'object') {
				// For object values, we loop through each key and add it to its own column
				// in the csv. Complex values are serialised to JSON.
				for (var i in data[path]) {
					if ({}.hasOwnProperty.call(data[path], i)) {
						var key = i.substr(0, 1).toUpperCase() + i.substr(1);
						var value = data[path][key];
						data[path + key] = (typeof value === 'object') ? JSON.stringify(value) : value;
					}
				}
				delete data[path];
			}
		}, this);
	}
	return data;
}

module.exports = getCSVData;
