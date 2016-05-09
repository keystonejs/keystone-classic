import {
	ADD_FILTER,
	CLEAR_FILTER,
	CLEAR_ALL_FILTERS,
	SET_ACTIVE_SEARCH,
	SET_ACTIVE_SORT,
	SET_ACTIVE_COLUMNS,
	SET_ACTIVE_LIST,
} from '../constants';
import { setCurrentPage, loadItems } from '../actions';

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
function addFilter (filter) {
	// TODO Make this a pure function again, find better way to call loadItems()
	// after each filtering change!
	return (dispatch) => {
		dispatch({
			type: ADD_FILTER,
			filter,
		});
		dispatch(loadItems());
	};
}

export function clearFilter (path) {
	// TODO Make this a pure function again, find better way to call loadItems()
	// after each filtering change!
	return (dispatch) => {
		dispatch({
			type: CLEAR_FILTER,
			path,
		});
		dispatch(loadItems());
	};
}

export function clearAllFilters () {
	// TODO Make this a pure function again, find better way to call loadItems()
	// after each filtering change!
	return (dispatch) => {
		dispatch({
			type: CLEAR_ALL_FILTERS,
		});
		dispatch(loadItems());
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
		dispatch(loadItems());
		dispatch(setCurrentPage(1));
	};
}
