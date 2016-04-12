import {
	SELECT_LIST,
	ITEMS_LOADED,
	LOAD_ITEMS,
	DELETE_ITEM,
	SET_ACTIVE_SEARCH,
	SET_ACTIVE_SORT,
	SET_CURRENT_PAGE,
	ITEM_LOADING_ERROR,
} from './constants';

export function selectList (id) {
	return {
		type: SELECT_LIST,
		id,
	};
}

export function loadItems () {
	return (dispatch, getState) => {
		dispatch({ type: LOAD_ITEMS });
		const state = getState();
		const currentList = state.lists.currentList;
		currentList.loadItems({
			search: state.lists.active.search,
			filters: state.lists.active.filters,
			sort: state.lists.active.sort,
			columns: state.lists.active.columns,
			page: state.lists.page,
		}, (err, items) => {
			// TODO: graceful error handling
			if (items) {
				// if (page.index !== drag.page && drag.item) {
				// 	// add the dragging item
				// 	if (page.index > drag.page) {
				// 		_items.results.unshift(drag.item);
				// 	} else {
				// 		_items.results.push(drag.item);
				// 	}
				// }
				// _itemsResultsClone = items.results.slice(0);
				//
				// if (options.success && options.id) {
				// 	// flashes a success background on the row
				// 	_rowAlert.success = options.id;
				// }
				// if (options.fail && options.id) {
				// 	// flashes a failure background on the row
				// 	_rowAlert.fail = options.id;
				// }
				dispatch(itemsLoaded(items));
			} else {
				dispatch(itemLoadingError(err));
			}
		});
	};
}

export function itemsLoaded (items) {
	return {
		type: ITEMS_LOADED,
		items,
	};
}

export function itemLoadingError (err) {
	return {
		type: ITEM_LOADING_ERROR,
		err,
	};
}

export function deleteItem (id) {
	return {
		type: DELETE_ITEM,
		id,
	};
}

export function deleteItems (ids) {
	// TODO IMPLEMENT WITH REDUX-THUNK
}

export function setActiveSearch (searchString) {
	return {
		type: SET_ACTIVE_SEARCH,
		searchString,
	};
}

export function setActiveSort (path) {
	return {
		type: SET_ACTIVE_SORT,
		path,
	};
}

export function setCurrentPage (index) {
	if (index === 1) index = undefined;
	return {
		type: SET_CURRENT_PAGE,
		index,
	};
}
