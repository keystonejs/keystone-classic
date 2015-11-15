'use strict';

import Store from 'store-prototype';
import List from '../lib/List';

var _list = new List(Keystone.list);
var _ready = false;
var _loading = false;
var _items = {};
var _itemsResultsClone = [];

var active = {
	columns: _list.expandColumns(Keystone.list.defaultColumns),
	filters: [],
	search: '',
	sort: _list.expandSort(Keystone.list.defaultSort),
};

var drag = defaultDrag();

function defaultDrag () {
	return drag = {
		page: 1,
		item: false,
		clonedItems: false,
		index: false
	};
}

var page = defaultPage();

function defaultPage () {
	return {
		size: _list.perPage,
		index: 1
	};
}

var _rowAlert = defaultRowAlert();

function defaultRowAlert () {
	return _rowAlert = {
		success: false,
		fail: false
	};
}

var CurrentListStore = new Store({
	getList () {
		return _list;
	},
	getDragBase () {
		return drag;
	},
	setDragBase (item, index) {
		drag.page = page.index;
		drag.clonedItems = _itemsResultsClone.slice(0);
		if(item) {
			drag.item = item;
			if(index) {
				drag.index = index;
			}
		}
		return drag;
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
	loadItems (options = {}) {
		_loading = true;
		defaultRowAlert();
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
				if (page.index !== drag.page && drag.item) {
					// add the dragging item
					if (page.index > drag.page) {
						_items.results.unshift(drag.item);
					} else {
						_items.results.push(drag.item);
					}
				}
				_itemsResultsClone =  items.results.slice(0);
				
				if (options.success && options.id) {
					// flashes a success background on the row
					_rowAlert.success = options.id;
				}
				if (options.fail && options.id) {
					// flashes a failure background on the row
					_rowAlert.fail = options.id;
				}
				
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
			if(err) {
				return this.resetItems(this.findItemById[item.id]);
			}
			this.loadItems();
		});
	},
	rowAlert (reset = false) {
		//  reset the alerts or return the object
		if(reset) {
			defaultRowAlert();
			return this.notifyChange();
		}
		return _rowAlert;
	},
	dragDropChangePage (page) {
		this.setCurrentPage(page);
	},
	moveItem (prevIndex, newIndex, options) {
		// moves an item up/down in the list
		if (options.manageMode) {
			// TODO: option to use manageMode for sortOrder
			_items.results.splice(newIndex, 0, _items.results.splice(prevIndex, 1)[0]);
		} else {
			_items.results.splice(newIndex, 0, _items.results.splice(prevIndex, 1)[0]);
		}
		this.notifyChange();
	},
	reorderItems (item, prevSortOrder, newSortOrder, goToPage) {
		// reset drag
		defaultDrag();
		// set the new page data
		page = {
			size: page.size,
			index: goToPage || page.index
		};
		// send the item, previous sortOrder and the new sortOrder
		// we should get the proper list and new page results in return
		_list.reorderItems(
			item,
			prevSortOrder,
			newSortOrder,
			{
				search: active.search,
				filters: active.filters,
				sort: active.sort,
				columns: active.columns,
				page
			},
			(err, items) => {
				// if err flash the row alert
				if(err) {
					return this.resetItems(this.findItemById[item.id]);
				}
				if('object' === typeof items && items.results) {
					_items = items;
					_itemsResultsClone =  items.results.slice(0);
					_rowAlert.success = item.id;
				}	
				return this.notifyChange();
			}
		);
	},
	findClonedItemById (id) {
		// find an item in the clone by id
		const item = _itemsResultsClone.filter(c => c.id === id)[0];
		return {
			item,
			index: _itemsResultsClone.indexOf(item)
		};
	},
	findClonedItemByIndex (index) {
		// find an item in the clone by index
		return _itemsResultsClone[index];
	},
	resetItems (itemIndex) {
				
		if (page.index !== drag.page) {
			// we are not on the original page so we need to move back to it
			page.index = drag.page;
			this.loadItems({
				fail: true,
				id: this.findClonedItemByIndex(itemIndex).id
			});
			// reset drag
			return defaultDrag();
		}
		
		// reset the list if dragout or error
		_rowAlert = {
			success: false,
			fail: this.findClonedItemByIndex(itemIndex).id
		};
		// we use the cached clone since this is the same page
		// the clone contains the proper index numbers which get overwritten on drag
		_items.results = drag.clonedItems;
		defaultDrag();
		this.notifyChange();
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
