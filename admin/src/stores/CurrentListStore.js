var listToArray = require('list-to-array');
var Store = require('store-prototype');
var utils = require('../utils');
var xhr = require('xhr');

var _list = Keystone.list;
var _ready = false;
var _loading = false;
var _items = {};

var available = {
	columns: _list.uiElements.map((col,i) => {
		if (col.type === 'heading') {
			return { type: 'heading', label: col.content };
		} else {
			var field = _list.fields[col.field];
			return field ? { type: 'field', field: field, title: field.label, path: field.path } : null;
		}
	}).map(i => i),
	filters: []
};

var active = {
	columns: expandColumns(_list.defaultColumns),
	filters: [],
	search: '',
	sort: expandSort(_list.defaultSort)
};

var page = defaultPage();

function defaultPage () {
	return {
		size: 100,
		index: 1
	};
}

function getFilters () {
	var filters = {};
	active.filters.forEach((filter) => {
		filters[filter.field.path] = filter.value;
	});
	return filters;
}

function getSortString () {
	return active.sort.paths.map(i => {
		return i.invert ? '-' + i.path : i.path;
	}).filter(i => i).join(',');
}

function buildQueryString () {
	var parts = [];
	parts.push(active.search ? 'search=' + active.search : '');
	parts.push(active.filters.length ? 'filters=' + JSON.stringify(getFilters()) : '');
	parts.push('select=' + active.columns.map(i => i.path).join(','));
	parts.push('limit=' + page.size);
	parts.push(page.index > 1 ? 'skip=' + ((page.index - 1) * page.size) : '');
	parts.push('expandRelationshipFields=true');
	parts.push('sort=' + getSortString());
	return '?' + parts.filter(i => i).join('&');
}

function expandColumns (input) {
	var nameIncluded = false;
	var cols = listToArray(input).map(i => {
		var split = i.split('|');
		var path = split[0];
		var width = split[1] || 'auto';
		if (path === '__name__') {
			path = _list.namePath;
		}
		if (path === _list.namePath) {
			nameIncluded = true;
		}
		var field = _list.fields[path];
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
}

function expandSort (input) {
	var sort = {
		rawInput: input || _list.defaultSort,
		isDefaultSort: false
	};
	sort.input = sort.rawInput;
	if (sort.input === '__default__') {
		sort.isDefaultSort = true;
		sort.input = _list.sortable ? 'sortOrder' : _list.namePath;
	}
	sort.paths = listToArray(sort.input).map(path => {
		var invert = false;
		if (path.charAt(0) === '-') {
			invert = true;
			path = path.substr(1);
		}
		var field = _list.fields[path];
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
}

var CurrentListStore = new Store({
	getList () {
		return _list;
	},
	getActiveColumns () {
		return active.columns;
	},
	getAvailableColumns () {
		return available.columns;
	},
	setActiveColumns (cols) {
		active.columns = expandColumns(cols);
		this.loadItems();
	},
	getActiveFilters () {
		return active.filters;
	},
	getAvailableFilters () {
		return available.filters;
	},
	setActiveSearch (str) {
		active.search = str;
		this.loadItems();
		this.notifyChange();
	},
	getActiveSearch () {
		return active.search;
	},
	getActiveSort () {
		return active.sort;
	},
	getPageSize () {
		return page.size;
	},
	getCurrentPage () {
		return page.index;
	},
	setCurrentPage (i) {
		page.index = i;
		this.loadItems();
	},
	addFilter (filter) {
		active.filters.push(filter);
		this.loadItems();
		this.notifyChange();
	},
	removeFilter (filter) {
		active.filters.splice(active.filters.indexOf(filter), 1);
		this.loadItems();
		this.notifyChange();
	},
	isLoading () {
		return _loading;
	},
	isReady () {
		return _ready;
	},
	loadItems () {
		_loading = true;
		var url = '/keystone/api/' + _list.path + buildQueryString();
		xhr({
			url: url
		}, (err, resp, body) => {
			// check resp.statusCode
			_loading = false;
			try {
				body = JSON.parse(body);
			} catch(e) {
				console.log('Error parsing results json:', e, body);
				return;
			}
			_ready = true;
			_items = body;
			this.notifyChange();
		});
	},
	getItems () {
		return _items;
	},
	deleteItem (item) {
		var url = '/keystone/api/' + _list.path + '/' + item.id + '/delete';
		xhr({
			url: url,
			method: 'POST',
			headers: Keystone.csrf.header
		}, (err, resp, body) => {
			try {
				body = JSON.parse(body);
			} catch(e) {
				console.log('Error parsing results json:', e, body);
				return;
			}
			this.loadItems();
		});
	}
});

module.exports = CurrentListStore;
