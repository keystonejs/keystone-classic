'use strict';

const listToArray = require('list-to-array');
const qs = require('qs');
const xhr = require('xhr');

function getColumns (list) {
	return list.uiElements.map((col) => {
		if (col.type === 'heading') {
			return { type: 'heading', content: col.content };
		} else {
			var field = list.fields[col.field];
			return field ? { type: 'field', field: field, title: field.label, path: field.path } : null;
		}
	}).filter(i => i);
}

function getFilters (filterArray) {
	var filters = {};
	filterArray.forEach((filter) => {
		filters[filter.field.path] = filter.value;
	});
	return filters;
};

function getSortString (sort) {
	return sort.paths.map(i => {
		return i.invert ? '-' + i.path : i.path;
	}).filter(i => i).join(',');
};

function buildQueryString (options) {
	const query = {};
	if (options.search) query.search = options.search;
	if (options.filters.length) query.filters = JSON.stringify(getFilters(options.filters));
	if (options.columns) query.select = options.columns.map(i => i.path).join(',');
	if (options.page && options.page.size) query.limit = options.page.size;
	if (options.page && options.page.index > 1) query.skip = (options.page.index - 1) * options.page.size;
	if (options.sort) query.sort = getSortString(options.sort);
	query.expandRelationshipFields = true;
	return '?' + qs.stringify(query);
};

const List = function (options) {
	Object.assign(this, options);
	this.columns = getColumns(this);
	this.expandedDefaultColumns = this.expandColumns(this.defaultColumns);
	this.defaultColumnPaths = this.expandedDefaultColumns.map(i => i.path).join(',');
};

List.prototype.expandColumns = function (input) {
	let nameIncluded = false;
	const cols = listToArray(input).map(i => {
		let split = i.split('|');
		let path = split[0];
		if (path === '__name__') {
			path = this.namePath;
		}
		if (path === this.namePath) {
			nameIncluded = true;
		}
		let field = this.fields[path];
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
	const sort = {
		rawInput: input || this.defaultSort,
		isDefaultSort: false
	};
	sort.input = sort.rawInput;
	if (sort.input === '__default__') {
		sort.isDefaultSort = true;
		sort.input = this.sortable ? 'sortOrder' : this.namePath;
	}
	sort.paths = listToArray(sort.input).map(path => {
		let invert = false;
		if (path.charAt(0) === '-') {
			invert = true;
			path = path.substr(1);
		}
		const field = this.fields[path];
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

List.prototype.loadItem = function (itemId, options, callback) {
	if (arguments.length === 2 && typeof options === 'function') {
		callback = options;
		options = null;
	}
	let url = Keystone.adminPath + '/api/' + this.path + '/' + itemId;
	let query = qs.stringify(options);
	if (query.length) url += '?' + query;
	xhr({
		url: url,
		responseType: 'json',
	}, (err, resp, data) => {
		if (err) return callback(err);
		// TODO: check resp.statusCode
		callback(err, data);
	});
};

List.prototype.loadItems = function (options, callback) {
	const url = Keystone.adminPath + '/api/' + this.path + buildQueryString(options);
	xhr({
		url: url,
		responseType: 'json',
	}, (err, resp, data) => {
		// TODO: check resp.statusCode
		callback(err, data);
	});
};

List.prototype.getDownloadURL = function (options) {
	const url = Keystone.adminPath + '/api/' + this.path;
	const parts = [];
	if (options.format !== 'json') {
		options.format = 'csv';
	}
	parts.push(options.search ? 'search=' + options.search : '');
	parts.push(options.filters.length ? 'filters=' + JSON.stringify(getFilters(options.filters)) : '');
	parts.push(options.columns ? 'select=' + options.columns.map(i => i.path).join(',') : '');
	parts.push(options.sort ? 'sort=' + getSortString(options.sort) : '');
	parts.push('expandRelationshipFields=true');
	return url + '/export.' + options.format + '?' + parts.filter(i => i).join('&');
};

List.prototype.deleteItem = function (itemId, callback) {
	this.deleteItems([itemId], callback);
};

List.prototype.deleteItems = function (itemIds, callback) {
	const url = Keystone.adminPath + '/api/' + this.path + '/' + itemIds.join(',') + '/delete';
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

List.prototype.reorderItems = function (item, oldSortOrder, newSortOrder, pageOptions, callback) {
	const url = Keystone.adminPath + '/api/' + this.path + '/' + item.id + '/sortOrder/' + oldSortOrder + '/' + newSortOrder + '/' + buildQueryString(pageOptions);
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
