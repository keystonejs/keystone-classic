import List from '../../../utils/List';
import {
	SELECT_LIST,
	ITEMS_LOADED,
	LOAD_ITEMS,
	DELETE_ITEM,
	SET_ACTIVE_SEARCH,
	SET_ACTIVE_SORT,
	SET_CURRENT_PAGE,
} from './constants';

const initialState = {
	currentList: null,
	loading: false,
	data: {},
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
			return Object.assing({}, state, {
				loading: false,
				data: {
					...state.data,
					[state.currentList]: action.items,
				},
			});
		case SELECT_LIST:
			return Object.assign({}, state, {
				currentList: new List(state.data[action.id]),
			});
		case DELETE_ITEM:
			// TODO Implementation
			return state;
		case SET_ACTIVE_SEARCH:
			// TODO Implementation
			return state;
		case SET_ACTIVE_SORT:
			// TODO Implementation
			return state;
		case SET_CURRENT_PAGE:
			// TODO Implementation
			return state;
		default:
			return state;
	}
}

export default lists;
