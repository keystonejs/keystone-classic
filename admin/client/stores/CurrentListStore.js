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
	columns: _list.expandColumns(_list.defaultColumns),
	filters: [],
	search: '',
	sort: _list.expandSort(_list.defaultSort),
};

const page = {
	size: 100,
	index: 1,
};

function updateQueryParams (params, replace) {
	if (!_location) return;
	let newParams = Object.assign({}, _location.query);
	Object.keys(params).forEach(i => {
		if (params[i]) {
			newParams[i] = params[i];
			if (typeof newParams[i] === 'object') {
				newParams[i] = JSON.stringify(newParams[i]);
			}
		} else {
			delete newParams[i];
		}
	});
	history[replace ? 'replaceState' : 'pushState'](null, _location.pathname, newParams);
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
	setActiveColumns (columns) {
		if (Array.isArray(columns)) columns = columns.join(',');
		if (columns === _list.defaultColumnPaths) columns = undefined;
		updateQueryParams({ columns });
	},
	getActiveSearch () {
		return active.search;
	},
	setActiveSearch (str) {
		// starting or clearing a search pushes a new history state, but updating
		// the current search replaces it for nicer history navigation support
		let replace = (str && this.getActiveSearch());
		updateQueryParams({ search: str }, replace);
	},
	getActiveSort () {
		return active.sort;
	},
	setActiveSort (sort) {
		if (sort === _list.defaultSort) sort = undefined;
		updateQueryParams({ sort });
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
		let filter = this.getFilter(path);
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
	setCurrentPage (index) {
		if (index === 1) index = undefined;
		updateQueryParams({ page: index });
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
	active.columns = _list.expandColumns(location.query.columns || _list.defaultColumns);
	active.search = location.query.search || '';
	active.sort = _list.expandSort(location.query.sort || _list.defaultSort);
	page.index = Number(location.query.page);
	if (isNaN(page.index)) page.index = 1;
	CurrentListStore.loadItems();
	CurrentListStore.notifyChange();
});

module.exports = CurrentListStore;
