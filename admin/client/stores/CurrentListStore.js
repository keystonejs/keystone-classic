'use strict';

var Store = require('store-prototype');
var List = require('../lib/List');

var _list = new List(Keystone.list);
var _ready = false;
var _loading = false;
var _items = {};
var _itemsResultsClone = [];

var active = {
	columns: _list.expandColumns(Keystone.list.defaultColumns),
	filters: [],
	search: '',
	sort: _list.expandSort(Keystone.list.defaultSort)
};

var page = defaultPage();

function defaultPage() {
	return {
		size: 100,
		index: 1
	};
}

var _rowAlert = defaultRowAlert();

function defaultRowAlert() {
	return _rowAlert = {
		success: false,
		fail: false
	};
}

var CurrentListStore = new Store({
	getList () {
		return _list;
	},
	getAvailableColumns() {
		return _list.columns;
	},
	getActiveColumns() {
		return active.columns;
	},
	setActiveColumns(cols) {
		active.columns = _list.expandColumns(cols);
		this.loadItems();
	},
	getActiveSearch() {
		return active.search;
	},
	setActiveSearch(str) {
		active.search = str;
		this.loadItems();
		this.notifyChange();
	},
	getActiveSort() {
		return active.sort;
	},
	setActiveSort(sort) {
		active.sort = _list.expandSort(sort || _list.defaultSort);
		this.loadItems();
		this.notifyChange();
	},
	getActiveFilters() {
		return active.filters;
	},
	getFilter(path) {
		return active.filters.filter(i => i.field.path === path)[0];
	},
	setFilter(path, value) {
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
	clearFilter(path) {
		var filter = active.filters.filter(i => i.field.path === path)[0];
		if (!filter) return;
		active.filters.splice(active.filters.indexOf(filter), 1);
		this.loadItems();
		this.notifyChange();
	},
	clearAllFilters() {
		active.filters = [];
		this.loadItems();
		this.notifyChange();
	},
	getPageSize() {
		return page.size;
	},
	getCurrentPage() {
		return page.index;
	},
	setCurrentPage(i) {
		page.index = i;
		this.loadItems();
	},
	isLoading() {
		return _loading;
	},
	isReady() {
		return _ready;
	},
	loadItems(options = {}) {
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
				_itemsResultsClone =  items.results.slice(0);
				
				if(options.success && options.id) {
					// flashes a success background on the row
					_rowAlert.success = options.id;
				}
				if(options.fail && options.id) {
					// flashes a failure background on the row
					_rowAlert.fail = options.id;
				}
			}
			this.notifyChange();
		});
	},
	getItems() {
		return _items;
	},
	deleteItem(item) {
		_list.deleteItem(item, (err, data) => {
			// TODO: graceful error handling
			if(err) {
				return this.resetItems(this.findItem[item.id])
			}
			this.loadItems();
		});
	},
	rowAlert(reset = false) {
		//  reset the alerts or return the object
		if(reset) {
			defaultRowAlert();
			return this.notifyChange();
		}
		return _rowAlert
	},
	reorderItems(item, prevSortOrder, newSortOrder) {
		// send the item, previous sortOrder and the new sortOrder
		_list.reorderItems(item, prevSortOrder, newSortOrder, (err, data) => {
			// if err flash the row alert
			if(err) {
				return this.resetItems(this.findItem[item.id])
			}
			// reload with the newly ordered list
			this.loadItems({
				success: true,
				id: item.id
			});
		});
	},
	moveItem(prevIndex, newIndex) {
		// moves an item up/down in the list
		_items.results.splice(newIndex, 0, _items.results.splice(prevIndex, 1)[0])
		this.notifyChange();
	},
	findItem(id) {
		// find an item in the clone by id
		const item = _itemsResultsClone.filter(c => c.id === id)[0];
		return {
			item,
			index: _itemsResultsClone.indexOf(item)
		};
	},
	findClonedItem(index) {
		// fing item in clone by index
		return _itemsResultsClone[index];
	},
	resetItems(itemIndex) {
		// reset the list if dragout or error
		_items.results = _itemsResultsClone.slice(0);
		_rowAlert = {
			success: false,
			fail: this.findClonedItem(itemIndex).id
		}
		this.notifyChange();
	},
	downloadItems(format, columns) {
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


var filtersFromUrlParams = function() {
	// Pick simple filters from url params
	// i.e. ?title={"mode":"contains","inverted":false,"value":"aaa"}
	// TODO: this should use react-router, or something pretty to parse
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
