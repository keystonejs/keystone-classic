import {
	SELECT_ITEM,
	LOAD_DATA,
	DATA_LOADING_SUCCESS,
	DATA_LOADING_ERROR,
} from './constants';

/**
 * Select an item
 *
 * @param  {String} itemId The item ID
 */
export function selectItem (itemId) {
	return {
		type: SELECT_ITEM,
		id: itemId,
	};
}

/**
 * Load the item data of the current item
 */
export function loadItemData () {
	return (dispatch, getState) => {
		dispatch({
			type: LOAD_DATA,
		});
		const state = getState();
		const list = state.lists.currentList;
		// Load a specific item with the utils/List.js helper
		list.loadItem(state.item.id, { drilldown: true }, (err, itemData) => {
			if (err || !itemData) {
				console.log('Error loading item data', err);
				dispatch(dataLoadingError(err));
			} else {
				dispatch(dataLoaded(itemData));
			}
		});
	};
}

/**
 * Called when data of the current item is loaded
 *
 * @param  {Object} data The item data
 */
export function dataLoaded (data) {
	return {
		type: DATA_LOADING_SUCCESS,
		data,
	};
}

/**
 * Called when there was an error during the loading of the current item data
 *
 * @param  {Object} error The error
 */
export function dataLoadingError (error) {
	return {
		type: DATA_LOADING_ERROR,
		error,
	};
}
