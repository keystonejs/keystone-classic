import {
	SELECT_LIST,
	ITEMS_LOADED,
} from './constants';

const initialState = {
	currentList: null,
	loading: false,
	data: {},
};

// Construct initial state from Keystone.lists
const initialLists = Keystone.lists;
for (const name in initialLists) {
	if ({}.hasOwnProperty.call(initialLists, name)) {
		initialState.data[name] = {
			items: [],
		};
	}
}

/**
 * Manage all lists
 */
function lists (state = initialState, action) {
	switch (action.type) {
		case ITEMS_LOADED:
			return Object.assing({}, state, {
				data: {
					...state.data,
					[state.currentList]: action.items,
				},
			});
		case SELECT_LIST:
			return Object.assign({}, state, {
				currentList: state.data[action.id],
			});
		default:
			return state;
	}
}

export default lists;
