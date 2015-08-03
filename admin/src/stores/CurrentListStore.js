var Store = require('store-prototype');
var utils = require('../utils');
var xhr = require('xhr');

var list = Keystone.list;

var available = {
	columns: list.uiElements.map((col,i) => {
		return {
			type: col.type === 'heading' ? 'header' : 'item',
			label: col.type === 'heading' ? col.content : utils.titlecase(col.field)
		};
	}),
	filters: []
};

var active = {
	columns: Keystone.columns,
	filters: []
};

var CurrentListStore = new Store({
	getActiveColumns () {
		return active.columns;
	},
	getAvailableColumns () {
		return available.columns;
	},
	getActiveFilters () {
		return active.filters;
	},
	getAvailableFilters () {
		return available.filters;
	},
	addFilter (filter) {
		active.filters.push(filter);
		this.notifyChange();
	},
	removeFilter (filter) {
		active.filters.splice(active.filters.indexOf(filter), 1);
		this.notifyChange();
	}
});

module.exports = CurrentListStore;
