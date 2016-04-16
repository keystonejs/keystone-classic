import List from '../../../../utils/List';
import {
	SELECT_LIST,
	ITEMS_LOADED,
	LOAD_ITEMS,
	ITEM_LOADING_ERROR,
	DELETE_ITEM,
	SET_CURRENT_PAGE,
	SET_ROW_ALERT,
	RESET_DRAG_PAGE,
	RESET_DRAG_ITEMS,
	SET_DRAG_ITEM,
	SET_DRAG_INDEX,
	DRAG_MOVE_ITEM,
} from '../constants';

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
		initialState.data[currentList.path].items = {};
	}
}

/**
 * Manage all lists
 */
function lists (state = initialState, action) {
	switch (action.type) {
		case SELECT_LIST:
			const list = state.data[action.id];
			return Object.assign({}, state, {
				currentList: list,
				page: {
					...state.page,
					index: 1,
					size: list.perPage,
				},
			});
		case LOAD_ITEMS:
			return Object.assign({}, state, {
				loading: true,
			});
		case ITEMS_LOADED:
			return Object.assign({}, state, {
				loading: false,
				ready: true,
				items: action.items,
			});
		case ITEM_LOADING_ERROR:
			// TODO Show error messages
			console.log('ERROR', action.err);
			return Object.assign({}, state, {
				loading: false,
				ready: true,
			});
		case DELETE_ITEM:
			// TODO Implementation
			return state;
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
			const items = state.items.results;
			const item = items[action.prevIndex];
			// Remove item at prevIndex from array and save that array in
			// itemsWithoutItem
			let itemsWithoutItem = items
				.slice(0, action.prevIndex)
				.concat(
					items.slice(
						action.prevIndex + 1,
						items.length
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
