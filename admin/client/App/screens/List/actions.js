import {
	SELECT_LIST,
	ITEMS_LOADED,
	DELETE_ITEM,
	SET_ACTIVE_SEARCH,
	SET_ACTIVE_SORT,
	SET_CURRENT_PAGE,
} from './constants';

export function selectList (id) {
	return {
		type: SELECT_LIST,
		id,
	};
}

export function itemsLoaded (items) {
	return {
		type: ITEMS_LOADED,
		items,
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

export function setCurrentPage (number) {
	return {
		type: SET_CURRENT_PAGE,
		number,
	};
}
