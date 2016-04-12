import List from '../../../utils/List';
import {
	SELECT_LIST,
	ITEMS_LOADED,
	LOAD_ITEMS,
	ITEM_LOADING_ERROR,
	DELETE_ITEM,
	SET_ACTIVE_SEARCH,
	SET_ACTIVE_SORT,
	SET_CURRENT_PAGE,
} from './constants';

const initialState = {
	currentList: null,
	loading: false,
	ready: false,
	data: {},
	filters: [],
	items: {
		results: [],
		count: null,
	},
	page: {
		size: null,
		index: undefined,
	},
	active: {
		columns: null,
		filter: null,
		search: null,
		sort: null,
	},
	rowAlert: {
		success: false,
		fail: false,
	},
};

// Rekey the lists in the state with their paths for easier matching with the
// URL parameters
const initialLists = Keystone.lists;
for (const name in initialLists) {
	if ({}.hasOwnProperty.call(initialLists, name)) {
		const currentList = initialLists[name];
		initialState.data[currentList.path] = currentList;
		initialState.data[currentList.path].items = {};
	}
}

/**
 * Manage all lists
 */
function lists (state = initialState, action) {
	switch (action.type) {
		case LOAD_ITEMS:
			return Object.assign({}, state, {
				loading: true,
			});
		case ITEMS_LOADED:
			return Object.assign({}, state, {
				loading: false,
				ready: true,
				items: action.items,
				currentList: {
					...state.currentList,
					items: action.items,
				},
				data: {
					...state.data,
					// Cache items for next round
					[state.currentList.path]: {
						...state.currentList.path,
						items: action.items,
					},
				},
			});
		case ITEM_LOADING_ERROR:
			console.log('ERROR', action.err);
			return Object.assign({}, state, {
				loading: false,
				ready: true,
			});
		case SELECT_LIST:
			const list = new List(state.data[action.id]);
			return Object.assign({}, state, {
				currentList: list,
				active: {
					...state.active,
					columns: list.expandColumns(list.defaultColumns),
					filters: [],
					search: '',
					sort: list.expandSort(list.defaultSort),
				},
				page: {
					...state.page,
					perPage: list.perPage,
				},
			});
		case DELETE_ITEM:
			// TODO Implementation
			return state;
		case SET_ACTIVE_SEARCH:
			return Object.assign({}, state, {
				active: {
					...state.active,
					search: action.searchString,
				},
			});
		case SET_ACTIVE_SORT:
			return Object.assign({}, state, {
				active: {
					...state.active,
					sort: action.path,
				},
			});
		case SET_CURRENT_PAGE:
			return Object.assign({}, state, {
				page: {
					...state.page,
					index: action.index,
				},
			});
		default:
			return state;
	}
}

export default lists;
