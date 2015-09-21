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

function buildQueryString () {
	return _list.buildQueryString({
		search: active.search,
		filters: active.filters,
		sort: active.sort,
		columns: active.columns,
		page: page
	});
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
			// TODO: check resp.statusCode
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
	downloadItems (format, columns) {
		var url = _list.getDownloadURL({
			search: active.search,
			filters: active.filters,
			sort: active.sort,
			columns: columns ? _list.expandColumns(columns) : active.columns,
			format: format
		});
		window.open(url);
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
