import {
	SELECT_LIST,
	SET_CURRENT_PAGE,
} from './constants';

import { setActiveList } from './actions/active';

export function selectList (id) {
	return (dispatch, getState) => {
		dispatch({
			type: SELECT_LIST,
			id,
		});
		dispatch(setActiveList(getState().lists.data[id]));
	};
}

export function setCurrentPage (index) {
	if (index === 1) index = undefined;
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
};
