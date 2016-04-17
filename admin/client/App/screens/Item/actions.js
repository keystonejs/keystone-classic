import {
	SELECT_ITEM,
	LOAD_DATA,
	DATA_LOADING_SUCCESS,
	DATA_LOADING_ERROR,
} from './constants';

export function selectItem (itemId) {
	return {
		type: SELECT_ITEM,
		id: itemId,
	};
}

export function loadItemData () {
	return (dispatch, getState) => {
		dispatch({
			type: LOAD_DATA,
		});
		const state = getState();
		const list = state.lists.currentList;
		list.loadItem(state.item.id, { drilldown: true }, (err, itemData) => {
			if (err || !itemData) {
				console.log('Error loading item data', err);
				dispatch(dataLoadingError(err));
				return;
			}
			dispatch(dataLoaded(itemData));
		});
	};
}

export function dataLoaded (data) {
	return {
		type: DATA_LOADING_SUCCESS,
		data,
	};
}

export function dataLoadingError (error) {
	return {
		type: DATA_LOADING_ERROR,
		error,
	};
}
