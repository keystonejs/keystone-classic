var listToArray = require('list-to-array');
var Store = require('store-prototype');
var utils = require('../utils');
var List = require('../lib/List');
var xhr = require('xhr');

var _list = new List(Keystone.list);
var _ready = false;
var _loading = false;
var _items = {};

var active = {
	columns: _list.expandColumns(Keystone.list.defaultColumns),
	filters: [],
	search: '',
	sort: _list.expandSort(Keystone.list.defaultSort)
};

var page = defaultPage();

function defaultPage () {
	return {
		size: 100,
		index: 1
	};
}

function getFilters () {
	return _list.getFilters(active.filters);
}

function getSortString () {
	return _list.getSortString(active.sort);
}

function buildQueryString () {
	return _list.buildQueryString({
		search: active.search,
		filters: active.filters,
		sort: active.sort,
		columns: active.columns,
		page: page
	});
}

function getDownloadURL (format, columns) {
	return _list.getDownloadURL({
		search: active.search,
		filters: active.filters,
		sort: active.sort,
		columns: columns ? _list.expandColumns(columns) : active.columns,
		format: format
	});
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
	getAvailableColumns () {
		return _list.columns;
	},
	getActiveColumns () {
		return active.columns;
	},
	setActiveColumns (cols) {
		active.columns = _list.expandColumns(cols);
		this.loadItems();
	},
	getActiveSearch () {
		return active.search;
	},
	setActiveSearch (str) {
		active.search = str;
		this.loadItems();
		this.notifyChange();
	},
	getActiveSort () {
		return active.sort;
	},
	setActiveSort (sort) {
		active.sort = _list.expandSort(sort || _list.defaultSort);
		this.loadItems();
		this.notifyChange();
	},
	getActiveFilters () {
		return active.filters;
	},
	getFilter (path) {
		return active.filters.filter(i => i.field.path === path)[0];
	},
	setFilter (path, value) {
		let filter = active.filters.filter(i => i.field.path === path)[0];
		if (filter) {
			filter.value = value;
		} else {
			let field = _list.fields[path];
			if (!field) {
				console.warn('Invalid Filter path specified:', path);
				return;
			}
			filter = { field, value };
			active.filters.push(filter);
		}
		this.loadItems();
		this.notifyChange();
	},
	clearFilter (path) {
		var filter = active.filters.filter(i => i.field.path === path)[0];
		if (!filter) return;
		active.filters.splice(active.filters.indexOf(filter), 1);
		this.loadItems();
		this.notifyChange();
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
	downloadItems (columns) {
		window.open(_list.getDownloadURL(columns));
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

// CurrentListStore.addFilter({
// 	field: columns.filter((i) => {
// 		return i.field && i.field.path === 'isAdmin';
// 	})[0].field,
// 	value: { value: true }
// });

module.exports = CurrentListStore;
