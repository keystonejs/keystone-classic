import {
	ADD_FILTER,
	CLEAR_FILTER,
	CLEAR_ALL_FILTERS,
	SET_ACTIVE_SEARCH,
	SET_ACTIVE_SORT,
	SET_ACTIVE_COLUMNS,
	SET_ACTIVE_LIST,
} from '../constants';

/*
* This method is a util, but has such a specific use that it is being left within
* the file that uses it.
*/
function createFilterObject (path, value, currentListFields) {
	const field = currentListFields[path];
	if (!field) {
		console.warn('Invalid Filter path specified:', path);
		return;
	}
	return {
		field,
		value,
	};
}

/**
 * Active actions
 */
export function setActiveSearch (searchString) {
	return {
		type: SET_ACTIVE_SEARCH,
		searchString,
	};
}

export function setActiveSort (path) {
	return (dispatch, getState) => {
		// TODO Decouple from state somehow
		const list = getState().lists.currentList;
		const sort = list.expandSort(path);
		dispatch({
			type: SET_ACTIVE_SORT,
			sort,
		});
	};
}

export function setActiveColumns (columns) {
	return (dispatch, getState) => {
		// TODO Decouple from state somehow
		const list = getState().lists.currentList;
		const expandedColumns = list.expandColumns(columns);
		dispatch({
			type: SET_ACTIVE_COLUMNS,
			columns: expandedColumns,
		});
	};
}

export function setActiveList (list, id) {
	return {
		type: SET_ACTIVE_LIST,
		list,
		id,
	};
}

/**
 * Filtering actions
 */

export function clearFilter (path) {
	return {
		type: CLEAR_FILTER,
		path,
	};
}

export function clearAllFilters () {
	return {
		type: CLEAR_ALL_FILTERS,
	};
}

// This is being used on first page load to set all filters from params
export function setActiveFilters (filters) {
	return (dispatch) => {
		filters.forEach((filter) => {
			const path = filter.path;
			delete filter.path;
			dispatch(setFilter(path, filter));
		});
	};
}

export function setFilter (path, value) {
	return (dispatch, getState) => {
		const state = getState();
		const activeFilters = state.active.filters;
		const currentList = state.lists.currentList;
		// Get current filter
		let filter = activeFilters.filter(i => i.field.path === path)[0];
		// If a filter exists already, update its value
		if (filter) {
			filter.value = value;
		// Otherwise construct a new one
		} else {
			filter = createFilterObject(path, value, currentList.fields);
			if (!filter) {
				return;
			}
		}
		dispatch({
			type: ADD_FILTER,
			filter,
		});
	};
}
