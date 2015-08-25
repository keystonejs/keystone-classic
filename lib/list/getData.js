var listToArray = require('list-to-array');

/**
 * Gets the data from an Item ready to be serialised for client-side use, as
 * used by the React components
 */

function getData (item, fields) {
	var data = {
		id: item.id,
		name: this.getDocumentName(item)
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
		data.fields = {};
		fields.forEach(function (path) {
			var field = this.fields[path];
			if (field) {
				data.fields[path] = field.getData(item);
			} else {
				data.fields[path] = item.get(path);
			}
		}, this);
	}
	return data;
}

module.exports = getData;
