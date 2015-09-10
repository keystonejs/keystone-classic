var listToArray = require('list-to-array');

function truthy (i) { return i; }

function expandSort(input) {
	var fields = this.fields;
	var sort = {
		rawInput: input || this.defaultSort,
		isDefaultSort: false
	};
	sort.input = sort.rawInput;
	if (sort.input === '__default__') {
		sort.isDefaultSort = true;
		sort.input = this.sortable ? 'sortOrder' : this.namePath;
	}
	sort.paths = listToArray(sort.input).map(function (path) {
		var invert = false;
		if (path.charAt(0) === '-') {
			invert = true;
			path = path.substr(1);
		}
		var field = fields[path];
		if (!field) {
			return;
		}
		return {
			field: field,
			type: field.type,
			label: field.label,
			path: field.path,
			invert: invert
		};
	}).filter(truthy);
	sort.string = sort.paths.map(function (i) {
		return i.invert ? '-' + i.path : i.path;
	}).join(' ');
	return sort;
}

module.exports = expandSort;
