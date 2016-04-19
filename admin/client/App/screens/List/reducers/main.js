import List from '../../../../utils/List';
import {
	SELECT_LIST,
	ITEMS_LOADED,
	LOAD_ITEMS,
	ITEM_LOADING_ERROR,
	SET_CURRENT_PAGE,
	SET_ROW_ALERT,
	RESET_DRAG_PAGE,
	RESET_DRAG_ITEMS,
	SET_DRAG_ITEM,
	SET_DRAG_INDEX,
	DRAG_MOVE_ITEM,
} from '../constants';

import {
	DELETE_ITEM,
} from '../../Item/constants';

const initialState = {
	currentList: null,
	loading: false,
	ready: false,
	data: {},
	items: {
		results: [],
		count: null,
	},
	page: {
		size: null,
		index: undefined,
	},
	rowAlert: {
		success: false,
		fail: false,
	},
	drag: {
		page: 1,
		item: false,
		clonedItems: false,
		index: false,
	},
};

// Rekey the lists in the state with their paths for easier matching with the
// URL parameters
const initialLists = Keystone.lists;
for (const name in initialLists) {
	if ({}.hasOwnProperty.call(initialLists, name)) {
		const currentList = initialLists[name];
		initialState.data[currentList.path] = new List(currentList);
		initialState.data[currentList.path].items = {
			results: [],
			count: null,
		};
	}
}

/**
 * Manage all lists
 */
function lists (state = initialState, action) {
	switch (action.type) {
		case SELECT_LIST:
			const list = state.data[action.id];
			list.id = action.id;
			let items = {
				results: [],
				count: null,
			};
			// If we have cached items, instead of resetting state.items put the
			// cached items in the state
			if (list.items.count !== null) {
				items = list.items;
			}
			return Object.assign({}, state, {
				currentList: list,
				ready: false,
				items: items,
				page: {
					...state.page,
					index: 1,
					size: list.perPage,
				},
			});
		case LOAD_ITEMS:
			let loading = true;
			let ready = state.ready;
			// If we have cached items ready, don't show a loading indicator
			// while we fetch the new items in the background
			if (state.items.count !== null) {
				loading = false;
				ready = true;
			}
			return Object.assign({}, state, {
				loading,
				ready,
			});
		case ITEMS_LOADED:
			// Cache the items in state.data so we can show the already existing
			// items on the next round trip while fetching the new items in the
			// background
			const cachedList = state.data[state.currentList.id];
			cachedList.items = action.items;
			return Object.assign({}, state, {
				loading: false,
				ready: true,
				items: action.items,
				data: {
					...state.data,
					[state.currentList.id]: cachedList,
				},
			});
		case ITEM_LOADING_ERROR:
			// TODO Show error messages
			console.log('ERROR', action.err);
			return Object.assign({}, state, {
				loading: false,
				ready: true,
			});
		case DELETE_ITEM:
			const newItems = {
				results: state.items.results.filter((el) => (el.id !== action.id)),
				count: state.items.count - 1,
			};
			const newCachedList = state.data[state.currentList.id];
			newCachedList.items = newItems;
			return Object.assign({}, state, {
				items: newItems,
				data: {
					...state.data,
					[state.currentList.id]: newCachedList,
				},
			});
		case SET_CURRENT_PAGE:
			return Object.assign({}, state, {
				page: {
					...state.page,
					index: action.index,
				},
			});
		case SET_ROW_ALERT:
			if (action.data.reset === true) {
				return Object.assign({}, state, {
					rowAlert: {
						success: false,
						fail: false,
					},
				});
			}
			return Object.assign({}, state, {
				rowAlert: {
					...state.rowAlert,
					...action.data,
				},
			});
		case RESET_DRAG_PAGE:
			return Object.assign({}, state, {
				drag: {
					...state.drag,
					page: state.page.index,
				},
			});
		case RESET_DRAG_ITEMS:
			return Object.assign({}, state, {
				drag: {
					...state.drag,
					clonedItems: state.items,
				},
			});
		case SET_DRAG_ITEM:
			return Object.assign({}, state, {
				drag: {
					...state.drag,
					item: action.item,
				},
			});
		case SET_DRAG_INDEX:
			return Object.assign({}, state, {
				drag: {
					...state.drag,
					index: action.index,
				},
			});
		case DRAG_MOVE_ITEM:
			// TODO: option to use manageMode for sortOrder
			const currentItems = state.items.results;
			const item = currentItems[action.prevIndex];
			// Remove item at prevIndex from array and save that array in
			// itemsWithoutItem
			let itemsWithoutItem = currentItems
				.slice(0, action.prevIndex)
				.concat(
					currentItems.slice(
						action.prevIndex + 1,
						currentItems.length
					)
				);
			// Add item back in at new index
			itemsWithoutItem.splice(action.newIndex, 0, item);
			return Object.assign({}, state, {
				items: {
					...state.items,
					results: itemsWithoutItem,
				},
			});
		default:
			return state;
	}
}

export default lists;
