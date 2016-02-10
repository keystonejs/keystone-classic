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
let _itemsResultsClone = [];

const _list = new List(Keystone.list);

const active = {
	columns: _list.expandColumns(_list.defaultColumns),
	filters: [],
	search: '',
	sort: _list.expandSort(_list.defaultSort),
};

let page = defaultPage();

function defaultPage () {
	return {
		size: _list.perPage,
		index: 1,
	};
}

// TODO: This is pretty messy; state variables should not be set by defaulters
// Needs to be reviewed & cleaned up

let drag;
function defaultDrag () {
	drag = {
		page: 1,
		item: false,
		clonedItems: false,
		index: false,
	};
	return drag;
}
defaultDrag();

var _rowAlert;
function defaultRowAlert () {
	_rowAlert = {
		success: false,
		fail: false,
	};
	return _rowAlert;
}
defaultRowAlert();

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
	getDragBase () {
		return drag;
	},
	setDragBase (item, index) {
		drag.page = page.index;
		drag.clonedItems = _itemsResultsClone.slice(0);
		if (item) {
			drag.item = item;
			if (index) {
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
	loadItems (options = {}) {
		_loading = true;
		defaultRowAlert();
		_list.loadItems({
			search: active.search,
			filters: active.filters,
			sort: active.sort,
			columns: active.columns,
			page: page,
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
				_itemsResultsClone = items.results.slice(0);

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
			if (err) {
				return this.resetItems(this.findItemById[itemId]);
			}
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
			format: format,
		});
		window.open(url);
	},
	rowAlert (reset = false) {
		//  reset the alerts or return the object
		if (reset) {
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
			index: goToPage || page.index,
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
				page,
			},
			(err, items) => {
				// if err flash the row alert
				if (err) {
					return this.resetItems(this.findItemById[item.id]);
				}
				if (typeof items !== 'object' && items.results) {
					_items = items;
					_itemsResultsClone = items.results.slice(0);
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
			index: _itemsResultsClone.indexOf(item),
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
				id: this.findClonedItemByIndex(itemIndex).id,
			});
			// reset drag
			return defaultDrag();
		}

		// reset the list if dragout or error
		_rowAlert = {
			success: false,
			fail: this.findClonedItemByIndex(itemIndex).id,
		};
		// we use the cached clone since this is the same page
		// the clone contains the proper index numbers which get overwritten on drag
		_items.results = drag.clonedItems;
		defaultDrag();
		this.notifyChange();
	},
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
