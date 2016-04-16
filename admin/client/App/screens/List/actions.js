import {
	SELECT_LIST,
	SET_CURRENT_PAGE,
} from './constants';

import { setActiveList } from './actions/active';

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
		dispatch(setActiveList(getState().lists.data[id]));
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
		index,
	};
}

// Export all actions from here again for easier usability, that they're split up
// should be an implementation detail of List

import {
	setFilter,
	clearFilter,
	clearAllFilters,
	setActiveSearch,
	setActiveColumns,
	setActiveSort,
} from './actions/active';

import {
	loadItems,
	itemsLoaded,
	itemLoadingError,
	deleteItem,
	deleteItems,
} from './actions/items';

import {
	setDragBase,
	resetItems,
	reorderItems,
	setRowAlert,
	moveItem,
} from './actions/dragdrop';

export {
	setFilter,
	clearFilter,
	clearAllFilters,
	setActiveSearch,
	setActiveColumns,
	setActiveSort,
	loadItems,
	itemsLoaded,
	itemLoadingError,
	deleteItem,
	deleteItems,
	setDragBase,
	resetItems,
	reorderItems,
	setRowAlert,
	moveItem,
};
