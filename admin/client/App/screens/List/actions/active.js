import {
	ADD_FILTER,
	CLEAR_FILTER,
	CLEAR_ALL_FILTERS,
	SET_ACTIVE_SEARCH,
	SET_ACTIVE_SORT,
	SET_ACTIVE_COLUMNS,
	SET_ACTIVE_LIST,
} from '../constants';
import { setCurrentPage } from '../actions';

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
	// TODO Figure out why we needed below checks in CurrentListSotre and
	// add them back in
	// if (Array.isArray(columns)) columns = columns.join(',');
	// if (columns === _list.defaultColumnPaths) columns = undefined;
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

export function setActiveList (list) {
	return {
		type: SET_ACTIVE_LIST,
		list,
	};
}

/**
 * Filtering actions
 */
function addFilter (filter) {
	return {
		type: ADD_FILTER,
		filter,
	};
}

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
			const field = currentList.fields[path];
			if (!field) {
				console.warn('Invalid Filter path specified:', path);
				return;
			}
			filter = {
				field,
				value,
			};
		}
		dispatch(addFilter(filter));
		dispatch(setCurrentPage(1));
	};
}
