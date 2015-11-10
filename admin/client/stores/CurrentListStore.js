'use strict';

var listToArray = require('list-to-array');
var Store = require('store-prototype');
var utils = require('../utils');
var List = require('../lib/List');

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
	deleteItem (item) {
		_list.deleteItem(item, (err, data) => {
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


var filtersFromUrlParams = function () {
	// Pick simple filters from url params
	// i.e. ?title={"mode":"contains","inverted":false,"value":"aaa"}
	// TODO: this should use react-router, or something pretty to parse
	var filters = [];
	var qs = _.object(
		_.compact(
			_.map(
				location.search.slice(1).split('&'),
				function(item) { if (item) return item.split('='); }
			)
		)
	);
	if (qs) {
		for (var field in qs) {
			var value = qs[field];
			if (value) {
				CurrentListStore.setFilter(field, JSON.parse(decodeURIComponent(value)));
			}
		}
	}
};
filtersFromUrlParams();


module.exports = CurrentListStore;
