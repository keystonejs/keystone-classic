import {
	SELECT_ITEM,
	LOAD_DATA,
	DATA_LOADING_SUCCESS,
	DATA_LOADING_ERROR,
	DRAG_MOVE_ITEM,
	DRAG_RESET_ITEMS,
	LOAD_RELATIONSHIP_DATA,
} from './constants';

import {
	loadItems,
} from '../List/actions';

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
		// Hold on to the id of the item we currently want to load.
		// Dispatch this reference to our redux store to hold on to as a 'loadingRef'.
		const currentItemID = getState().item.id;
		dispatch({
			type: LOAD_DATA,
		});
		const state = getState();
		const list = state.lists.currentList;

		// const itemID = state.item.id;
		// Load a specific item with the utils/List.js helper
		list.loadItem(state.item.id, { drilldown: true }, (err, itemData) => {

			// Once this async request has fired this callback, check that
			// the item id referenced by thisLoadRef is the same id
			// referenced by loadingRef in the redux store.

			// If it is, then this is the latest request, and it is safe to resolve it normally.
			// If it is not the same id however,
			// this means that this request is NOT the latest fired request,
			// and so we'll bail out of it early.

			if (getState().item.id !== currentItemID) return;
			if (err || !itemData) {
				dispatch(dataLoadingError(err));
			} else {
				dispatch(dataLoaded(itemData));
			}
		});
	};
}

export function loadRelationshipItemData ({ columns, refList, relationship, relatedItemId }) {
	return (dispatch, getState) => {
		refList.loadItems({
			columns: columns,
			filters: [{
				field: refList.fields[relationship.refPath],
				value: { value: relatedItemId },
			}],
		}, (err, items) => {
			// // TODO: indicate pagination & link to main list view
			// this.setState({ items });
			dispatch(relationshipDataLoaded(relationship.path, items));
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

export function relationshipDataLoaded (path, data) {
	return {
		type: LOAD_RELATIONSHIP_DATA,
		relationshipPath: path,
		data,
	};
};

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
		const state = getState();
		const list = state.lists.currentList;
		list.deleteItem(id, (err) => {
			// If a router is passed, redirect to the current list path,
			// otherwise stay where we are
			if (router) {
				let redirectUrl = `${Keystone.adminPath}/${list.path}`;
				if (state.lists.page.index && state.lists.page.index > 1) {
					redirectUrl = `${redirectUrl}?page=${state.lists.page.index}`;
				}
				console.log(state, redirectUrl);
				router.push(redirectUrl);
			}
			// TODO Proper error handling
			if (err) {
				alert('Error deleting item, please try again!');
			} else {
				dispatch(loadItems());
			}
		});
	};
}

export function reorderItems ({ columns, refList, relationship, relatedItemId, item, prevSortOrder, newSortOrder }) {
	return (dispatch, getState) => {
		// Send the item, previous sortOrder and the new sortOrder
		// we should get the proper list and new page results in return
		refList.reorderItems(
			item,
			prevSortOrder,
			newSortOrder,
			{
				columns: columns,
				filters: [{
					field: refList.fields[relationship.refPath],
					value: { value: relatedItemId },
				}],
			},
			(err, items) => {
				dispatch(relationshipDataLoaded(relationship.path, items));
				// If err, flash the row alert
				// if (err) {
				// 	dispatch(resetItems(item.id));
				// 	// return this.resetItems(this.findItemById[item.id]);
				// } else {
				// 	dispatch(itemsLoaded(items));
				// 	dispatch(setRowAlert({
				// 		success: item.id,
				// 		fail: false,
				// 	}));
				// }
			}
		);
	};
}

export function moveItem ({ prevIndex, newIndex, relationshipPath, newSortOrder }) {
	return {
		type: DRAG_MOVE_ITEM,
		prevIndex,
		newIndex,
		relationshipPath,
		newSortOrder,
	};
}

export function resetItems () {
	return {
		type: DRAG_RESET_ITEMS,
	};
}
