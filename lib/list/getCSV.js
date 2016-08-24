var listToArray = require('list-to-array');

/**
 * Gets the data from an Item ready to be serialised to CSV for download
 */

function getCSV (item, fields, expandRelationshipFields) {
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
					data[path] = field.format(item);
				}
			} else {
				data[path] = item.get(path);
			}
			if (Array.isArray(data[path])) {
				data[path] = JSON.stringify(data[path]);
			} else if (typeof data[path] === 'object') {
				for (var i in data[path]) {
					if ({}.hasOwnProperty.call(data[path], i)) {
						var key = i.substr(0, 1).toUpperCase() + i.substr(1);
						data[path + key] = data[path][key];
					}
				}
				delete data[path];
			}
		}, this);
	}
	return data;
}

module.exports = getCSV;
