import remove from 'lodash/remove';
import map from 'lodash/map';
import {
	ADD_FILTER,
	CLEAR_FILTER,
	CLEAR_ALL_FILTERS,
	SET_ACTIVE_SEARCH,
	SET_ACTIVE_SORT,
	SET_ACTIVE_COLUMNS,
	SET_ACTIVE_LIST,
} from '../constants';

const initialState = {
	columns: [],
	filters: [],
	search: '',
	sort: {
		input: '',
		isDefaultSort: false,
		paths: [],
		rawInput: '',
	},
};

/**
 * Manage the active state
 */
function active (state = initialState, action) {
	switch (action.type) {
		case SET_ACTIVE_LIST:
			return Object.assign({}, state, {
				id: action.id,
				columns: action.list.expandColumns(action.list.defaultColumns),
				filters: [],
				search: '',
				sort: action.list.expandSort(action.list.defaultSort),
			});
		case SET_ACTIVE_SEARCH:
			return Object.assign({}, state, {
				search: action.searchString,
			});
		case SET_ACTIVE_SORT:
			return Object.assign({}, state, {
				sort: action.sort,
			});
		case SET_ACTIVE_COLUMNS:
			return Object.assign({}, state, {
				columns: action.columns,
			});
		case ADD_FILTER:
			let existsIndex;
			let filters;
			let activeFilters = state.filters;
			// Check if a filter for the passed path exists already, and save the
			// index if it does
			const filterExists = Object.keys(activeFilters).some((filter, index) => {
				existsIndex = index;
				return activeFilters[filter].field.path === action.filter.field.path;
			});
			// If a filter doesn't exists already, simply add it to the existing filters value
			if (!filterExists) {
				filters = activeFilters.concat(action.filter);
			// otherwise replace it with the new filter
			} else {
				filters = map(activeFilters, (filter, index) => {
					if (index === existsIndex) {
						return action.filter;
					} else {
						return filter;
					}
				});
			}
			return Object.assign({}, state, {
				filters,
			});
		case CLEAR_FILTER:
			let newFilters = remove(state.filters, (filter) => {
				return filter.field.path !== action.path;
			});
			return Object.assign({}, state, {
				filters: newFilters,
			});
		case CLEAR_ALL_FILTERS:
			return Object.assign({}, state, {
				filters: [],
			});
		default:
			return state;
	}
}

export default active;
