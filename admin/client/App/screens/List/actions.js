import {
	SELECT_LIST,
	ITEMS_LOADED,
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
