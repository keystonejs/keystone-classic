import {
	SELECT_ITEM,
	LOAD_DATA,
	DATA_LOADING_SUCCESS,
	DATA_LOADING_ERROR,
	DELETE_ITEM,
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
		const thisLoadRef = {};
		dispatch({
			type: LOAD_DATA,
			loadingRef: thisLoadRef,
		});
		const state = getState();
		const list = state.lists.currentList;
		// Load a specific item with the utils/List.js helper
		list.loadItem(state.item.id, { drilldown: true }, (err, itemData) => {
			if (err || !itemData) {
				if (getState().loadingRef !== thisLoadRef) return;
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
		loadingRef: null,
		data,
	};
}

/**
 * Called when there was an error during the loading of the current item data,
 * will retry loading the data ever NETWORK_ERROR_RETRY_DELAY milliseconds
 *
 * @param  {Object} error The error
 */
export function dataLoadingError (err) {
	return {
		type: DATA_LOADING_ERROR,
		loadingRef: null,
		error: err,
	};
}

/**
 * Deletes an item and optionally redirects to the current list URL
 *
 * @param  {String} id     The ID of the item we want to delete
 * @param  {Object} router A react-router router object. If this is passed, we
 *                         redirect to Keystone.adminPath/currentList.path!
 */
export function deleteItem (id, router) {
	return (dispatch, getState) => {
		const list = getState().lists.currentList;
		list.deleteItem(id, (err) => {
			// If a router is passed, redirect to the current list path,
			// otherwise stay where we are
			if (router) {
				router.push(`${Keystone.adminPath}/${list.path}`);
			}
			// TODO Proper error handling
			if (err) {
				alert('Error deleting item, please try again!');
				console.log(err);
			} else {
				dispatch({
					type: DELETE_ITEM,
					id,
				});
			}
		});
	};
}
