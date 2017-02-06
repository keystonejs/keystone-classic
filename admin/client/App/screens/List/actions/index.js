import {
	SELECT_LIST,
	SET_CURRENT_PAGE,
	INITIAL_LIST_LOAD,
} from '../constants';

import { setActiveList } from './active';

/**
 * Select a list, and set it as the active list. Called whenever the main
 * List component mounts or the list changes.
 *
 * @param  {String} id The list ID, passed via this.props.params.listId
 */
export function selectList (id) {
	return (dispatch, getState) => {
		dispatch({
			type: SELECT_LIST,
			id,
		});
		dispatch(setActiveList(getState().lists.data[id], id));
	};
}

export function loadInitialItems () {
	return {
		type: INITIAL_LIST_LOAD,
	};
}

/**
 * Set the current page
 *
 * @param {Number} index The page number we want to be on
 */
export function setCurrentPage (index) {
	return {
		type: SET_CURRENT_PAGE,
		index: parseInt(index),
	};
}

// Export all actions from here again for easier usability, that they're split up
// should be an implementation detail of List

import {
	setFilter,
	clearFilter,
	clearAllFilters,
	setActiveFilters,
	setActiveSearch,
	setActiveColumns,
	clearCachedQuery,
	setActiveSort,
} from './active';

import {
	loadItems,
	itemsLoaded,
	itemLoadingError,
	deleteItems,
	downloadItems,
} from './items';

import {
	setDragBase,
	resetItems,
	reorderItems,
	setRowAlert,
	moveItem,
} from './dragdrop';

export {
	setFilter,
	clearFilter,
	clearAllFilters,
	setActiveFilters,
	setActiveSearch,
	setActiveColumns,
	setActiveSort,
	clearCachedQuery,
	loadItems,
	itemsLoaded,
	itemLoadingError,
	deleteItems,
	setDragBase,
	resetItems,
	reorderItems,
	setRowAlert,
	moveItem,
	downloadItems,
};
