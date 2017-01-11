import {
	ADD_FILTER,
	CLEAR_FILTER,
	CLEAR_ALL_FILTERS,
	SET_ACTIVE_SEARCH,
	SET_ACTIVE_SORT,
	SET_ACTIVE_COLUMNS,
	SET_ACTIVE_LIST,
	SET_FILTERS,
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
var counter = 0;
export function setActiveFilters (filters) {
	console.log('HELLO? THIS IS THE SETACTIVEFILTERS FN', filters);
	counter++;
	console.log(`THIS METHOD HAS BEEN EXECUTED ${counter} TIMES`);
	if (counter >= 10) {
		console.log('BAILING OUT');
		return;
	}

	return (dispatch, getState) => {

		let filterString = '';
		const { active, lists } = getState();
		const { currentList } = lists;
		const { manuallyUpdatedUrl } = active;

		if (typeof filters === 'string') {
			filterString = filters;

			// if (manuallyUpdatedUrl) {
			// 	console.log('manually updated url');
			// 	return {
			// 		filterString,
			// 		type: 'UNSET_MANUALLY_UPDATED_URL',
			// 	};
			// }
			try {
				filters = JSON.parse(filters);
				console.log('PARSED FILTER', filters);
			} catch (e) {
				console.log('invalid filters provided');
				return;
			}
		}

		// For each filter, assemble it from the current list's
		const assembledFilters = filters.map((filter) => {
			const path = filter.path;
			const value = Object.assign({}, filter);
			delete value.path;
			return createFilterObject(path, value, currentList.fields);
		});
		// Remove any filters that were not able to be assembled
		const nonEmptyFilters = assembledFilters.filter(filter => filter);
		dispatch({
			type: SET_FILTERS,
			filters: nonEmptyFilters,
			cachedFilterString: filterString,
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
