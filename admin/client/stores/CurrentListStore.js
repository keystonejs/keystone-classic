'use strict';

import createHistory from 'history/lib/createBrowserHistory';
import useQueries from 'history/lib/useQueries';
import Store from 'store-prototype';
import List from '../lib/List';

let history = useQueries(createHistory)();

let _location = null;
let _ready = false;
let _loading = false;
let _items = {};

const _list = new List(Keystone.list);

const active = {
	columns: _list.expandColumns(Keystone.list.defaultColumns),
	filters: [],
	search: '',
	sort: _list.expandSort(Keystone.list.defaultSort)
};

const page = {
	size: 100,
	index: 1
};

function updateQueryParams (params) {
	if (!_location) return;
	let newParams = Object.assign({}, _location.query);
	Object.keys(params).forEach(i => {
		if (params[i]) newParams[i] = params[i];
		else delete newParams[i];
	});
	history.pushState(null, _location.pathname, newParams);
}

const CurrentListStore = new Store({
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
		updateQueryParams({ search: str });
	},
	getActiveSort () {
		return active.sort;
	},
	setActiveSort (sort) {
		active.sort = _list.expandSort(sort || _list.defaultSort);
		this.loadItems();
		this.notifyChange();
	},
	getAvailableFilters () {
		return _list.columns.filter(col => col.field && col.field.hasFilterMethod);
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
		this.setCurrentPage(1);
		this.notifyChange();
	},
	clearFilter (path) {
		var filter = active.filters.filter(i => i.field.path === path)[0];
		if (!filter) return;
		active.filters.splice(active.filters.indexOf(filter), 1);
		this.loadItems();
		this.notifyChange();
	},
	clearAllFilters () {
		active.filters = [];
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
		_list.loadItems({
			search: active.search,
			filters: active.filters,
			sort: active.sort,
			columns: active.columns,
			page: page
		}, (err, items) => {
			_loading = false;
			// TODO: graceful error handling
			if (items) {
				_ready = true;
				_items = items;
			}
			this.notifyChange();
		});
	},
	getItems () {
		return _items;
	},
	deleteItem (itemId) {
		_list.deleteItem(itemId, (err, data) => {
			// TODO: graceful error handling
			this.loadItems();
		});
	},
	deleteItems (itemIds) {
		_list.deleteItems(itemIds, (err, data) => {
			// TODO: graceful error handling
			this.loadItems();
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
	}
});

history.listen(function (location) {
	_location = location;
	let querySearch = location.query.search || '';
	if (active.search !== querySearch) {
		active.search = querySearch;
		CurrentListStore.loadItems();
		CurrentListStore.notifyChange();
	}
});

module.exports = CurrentListStore;
