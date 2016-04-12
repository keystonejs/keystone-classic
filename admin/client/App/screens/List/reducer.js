import map from 'lodash/map';
import remove from 'lodash/remove';

import List from '../../../utils/List';
import {
	ADD_FILTER,
	CLEAR_FILTER,
	SELECT_LIST,
	ITEMS_LOADED,
	LOAD_ITEMS,
	ITEM_LOADING_ERROR,
	DELETE_ITEM,
	SET_ACTIVE_SEARCH,
	SET_ACTIVE_SORT,
	SET_ACTIVE_COLUMNS,
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
		filters: [],
		search: '',
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
		case LOAD_ITEMS:
			return Object.assign({}, state, {
				loading: true,
			});
		case ITEMS_LOADED:
			return Object.assign({}, state, {
				loading: false,
				ready: true,
				items: action.items,
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
		case SET_ACTIVE_COLUMNS:
			return Object.assign({}, state, {
				active: {
					...state.active,
					columns: action.columns,
				},
			});
		case SET_CURRENT_PAGE:
			return Object.assign({}, state, {
				page: {
					...state.page,
					index: action.index,
				},
			});
		case ADD_FILTER:
			let existsIndex;
			let filters;
			// Check if a filter for the passed path exists already, and save the
			// index if it does
			const filterExists = Object.keys(state.active.filters).some((filter, index) => {
				existsIndex = index;
				return state.active.filters[filter].field.path === action.filter.field.path;
			});
			// If a filter doesn't exists already, simply add it to the existing filters value
			if (!filterExists) {
				filters = state.active.filters.concat(action.filter);
			// otherwise replace it with the new filter
			} else {
				filters = map(state.active.filters, (filter, index) => {
					if (index === existsIndex) {
						return action.filter;
					} else {
						return filter;
					}
				});
			}
			return Object.assign({}, state, {
				active: {
					...state.active,
					filters: filters,
				},
			});
		case CLEAR_FILTER:
			let activeFilters = remove(state.active.filters, (filter) => {
				console.log(filter.field.path, action.path);
				return filter.field.path !== action.path;
			});
			console.log(activeFilters);
			return Object.assign({}, state, {
				active: {
					...state.active,
					filters: activeFilters,
				},
			});
		default:
			return state;
	}
}

export default lists;
