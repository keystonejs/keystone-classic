var listToArray = require('list-to-array');

/**
 * Gets the data from an Item ready to be serialised to CSV for download
 */

function getData (item, fields, expandRelationshipFields) {
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
			throw new Error('List.getData: fields must be undefined, a string, or an array.');
		}
		fields.forEach(function (path) {
			var field = this.fields[path];
			if (field) {
				if (field.type === 'relationship' && expandRelationshipFields) {
					data[path] = field.getExpandedData(item);
				} else {
					data[path] = field.format(item);
				}
			} else {
				data[path] = item.get(path);
			}
			if (typeof data[path] === 'object') {
				data[path] = JSON.stringify(data[path]);
			}
		}, this);
	}
	return data;
}

module.exports = getData;
