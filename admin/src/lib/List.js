var listToArray = require('list-to-array');
var xhr = require('xhr');

function getColumns (list) {
	return list.uiElements.map((col, i) => {
		if (col.type === 'heading') {
			return { type: 'heading', content: col.content };
		} else {
			var field = list.fields[col.field];
			return field ? { type: 'field', field: field, title: field.label, path: field.path } : null;
		}
	}).filter(i => i);
}

const List = function (options) {
	Object.assign(this, options);
	this.columns = getColumns(this);
};

List.prototype.expandColumns = function (input) {
	var nameIncluded = false;
	var cols = listToArray(input).map(i => {
		var split = i.split('|');
		var path = split[0];
		var width = split[1] || 'auto';
		if (path === '__name__') {
			path = this.namePath;
		}
		if (path === this.namePath) {
			nameIncluded = true;
		}
		var field = this.fields[path];
		if (!field) {
			// TODO: Support arbitary document paths
			console.warn('Invalid Column specified:', i);
			return;
		}
		return {
			field: field,
			type: field.type,
			label: field.label,
			path: field.path
		};
	}).filter(i => i);
	if (!nameIncluded) {
		cols.unshift({
			type: 'id',
			label: 'ID',
			path: 'id'
		});
	}
	return cols;
};

List.prototype.expandSort = function (input) {
	var sort = {
		rawInput: input || this.defaultSort,
		isDefaultSort: false
	};
	sort.input = sort.rawInput;
	if (sort.input === '__default__') {
		sort.isDefaultSort = true;
		sort.input = this.sortable ? 'sortOrder' : this.namePath;
	}
	sort.paths = listToArray(sort.input).map(path => {
		var invert = false;
		if (path.charAt(0) === '-') {
			invert = true;
			path = path.substr(1);
		}
		var field = this.fields[path];
		if (!field) {
			// TODO: Support arbitary document paths
			console.warn('Invalid Sort specified:', path);
			return;
		}
		return {
			field: field,
			type: field.type,
			label: field.label,
			path: field.path,
			invert: invert
		};
	}).filter(i => i);
	return sort;
};

List.prototype.getFilters = function (filterArray) {
	var filters = {};
	filterArray.forEach((filter) => {
		filters[filter.field.path] = filter.value;
	});
	return filters;
};

List.prototype.getSortString = function (sort) {
	return sort.paths.map(i => {
		return i.invert ? '-' + i.path : i.path;
	}).filter(i => i).join(',');
};

List.prototype.getDownloadURL = function (options) {
	var url = '/keystone/api/' + this.path;
	var parts = [];
	if (options.format !== 'json') {
		options.format = 'csv';
	}
	parts.push(options.search ? 'search=' + options.search : '');
	parts.push(options.filters.length ? 'filters=' + JSON.stringify(this.getFilters(options.filters)) : '');
	parts.push('select=' + options.columns.map(i => i.path).join(','));
	parts.push('expandRelationshipFields=true');
	parts.push('sort=' + this.getSortString(options.sort));
	return url + '/export.' + options.format + '?' + parts.filter(i => i).join('&');
};

List.prototype.buildQueryString = function (options) {
	var parts = [];
	parts.push(options.search ? 'search=' + options.search : '');
	parts.push(options.filters.length ? 'filters=' + JSON.stringify(this.getFilters(options.filters)) : '');
	parts.push('select=' + options.columns.map(i => i.path).join(','));
	parts.push('limit=' + options.page.size);
	parts.push(options.page.index > 1 ? 'skip=' + ((options.page.index - 1) * options.page.size) : '');
	parts.push('expandRelationshipFields=true');
	parts.push('sort=' + this.getSortString(options.sort));
	return '?' + parts.filter(i => i).join('&');
};

List.prototype.loadItems = function (options, callback) {
	var url = '/keystone/api/' + this.path + this.buildQueryString(options);
	xhr({
		url: url
	}, (err, resp, body) => {
		if (err) return callback(err);
		// TODO: check resp.statusCode
		try {
			body = JSON.parse(body);
		} catch (e) {
			console.log('Error parsing results json:', e, body);
			return callback(e);
		}
		callback(null, body);
	});
};

List.prototype.deleteItem = function (item, callback) {
	var url = '/keystone/api/' + this.path + '/' + item.id + '/delete';
	xhr({
		url: url,
		method: 'POST',
		headers: Keystone.csrf.header
	}, (err, resp, body) => {
		if (err) return callback(err);
		// TODO: check resp.statusCode
		try {
			body = JSON.parse(body);
		} catch(e) {
			console.log('Error parsing results json:', e, body);
			return callback(e);
		}
		callback(null, body);
	});
};

module.exports = List;
