/**
 * Gets the data from an Item ready to be serialised for client-side use, as
 * used by the React components and the Admin API
 */
var listToArray = require('list-to-array');

function getData (item, fields, expandRelationshipFields) {
	var data = {
		id: item.id,
		name: this.getDocumentName(item),
	};
	if (this.autokey) {
		data[this.autokey.path] = item.get(this.autokey.path);
	}
	if (this.options.sortable) {
		data.sortOrder = item.sortOrder;
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
				if (field.type === 'relationship' && expandRelationshipFields) {
					data.fields[path] = field.getExpandedData(item);
				} else {
					data.fields[path] = field.getData(item);
				}
			} else {
				data.fields[path] = item.get(path);
			}
		}, this);
	}
	return data;
}

module.exports = getData;
