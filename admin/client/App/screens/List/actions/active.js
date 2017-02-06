import {
	CLEAR_FILTER,
	CLEAR_ALL_FILTERS,
	CLEAR_CACHED_QUERY,
	SET_ACTIVE_SEARCH,
	SELECT_ACTIVE_SORT,
	SELECT_ACTIVE_COLUMNS,
	SET_ACTIVE_LIST,
	SELECT_FILTER,
} from '../constants';


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
	return {
		type: SELECT_ACTIVE_SORT,
		path,
	};
}

export function setActiveColumns (columns) {
	return {
		type: SELECT_ACTIVE_COLUMNS,
		columns,
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

export function setFilter (path, value) {
	return {
		type: SELECT_FILTER,
		filter: { path, value },
	};
}


export function clearCachedQuery () {
	return {
		type: CLEAR_CACHED_QUERY,
	};
}
