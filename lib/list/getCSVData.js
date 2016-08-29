var _ = require('lodash');
var assign = require('object-assign');
var listToArray = require('list-to-array');

/**
 * Applies option field transforms to get the CSV value for a field
 */

function transformFieldValue (field, item, options) {
	console.log('Trasforming field ' + field.path + ' with toCSV:', field.options.toCSV);
	var transform = typeof field.options.toCSV === 'string'
		? listToArray(field.options.toCSV)
		: field.options.toCSV;
	if (typeof transform === 'function') {
		return transform.call(item, field, options);
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

function getCSVData (item, options) {
	if (!options) {
		options = {};
	}
	options.fields;
	if (options.fields === undefined) {
		options.fields = Object.keys(this.options.fields);
	}
	var data = {
		id: String(item.id),
	};
	if (this.autokey) {
		data[this.autokey.path] = item.get(this.autokey.path);
	}
	if (options.fields) {
		if (typeof options.fields === 'string') {
			options.fields = listToArray(options.fields);
		}
		if (!Array.isArray(options.fields)) {
			throw new Error('List.getCSV: options.fields must be undefined, a string, or an array.');
		}
		options.fields.forEach(function (path) {
			var field = this.fields[path];
			if (field) {
				if (field.type === 'relationship' && options.expandRelationshipFields) {
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
					data[path] = transformFieldValue(field, item, options);
				}
			} else {
				data[path] = item.get(path);
			}
		}, this);
	}
	if (typeof item.getCSVData === 'function') {
		var ext = item.getCSVData(data, options);
		if (typeof ext === 'object') {
			assign(data, ext);
		}
	}
	// Copy each value into the return structure, flattening arrays into lists and
	// flattening objects into a column per property (one level only)
	var rtn = {};
	_.forOwn(data, function (value, prop) {
		if (Array.isArray(value)) {
			// Array values are serialised to JSON, this should be an edge-case catch
			// for data coming raw from the item; array-type fields will already have
			// been stringified by the field.format method.
			rtn[prop] = JSON.stringify(value);
		} else if (typeof value === 'object') {
			// For object values, we loop through each key and add it to its own column
			// in the csv. Complex values are serialised to JSON.
			_.forOwn(value, function (v, i) {
				var suffix = i.substr(0, 1).toUpperCase() + i.substr(1);
				rtn[prop + suffix] = (typeof v === 'object') ? JSON.stringify(v) : v;
			});
		} else {
			rtn[prop] = value;
		}
	});

	return rtn;
}

module.exports = getCSVData;
