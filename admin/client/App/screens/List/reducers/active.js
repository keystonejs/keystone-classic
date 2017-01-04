import _ from 'lodash';
import assign from 'object-assign';

import {
	ADD_FILTER,
	CLEAR_FILTER,
	CLEAR_ALL_FILTERS,
	SET_ACTIVE_SEARCH,
	SET_ACTIVE_SORT,
	SET_ACTIVE_COLUMNS,
	SET_ACTIVE_LIST,
	SET_FILTERS,
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
			return assign({}, state, {
				id: action.id,
				columns: action.list.expandColumns(action.list.defaultColumns),
				filters: [],
				search: '',
				sort: action.list.expandSort(action.list.defaultSort),
			});
		case SET_ACTIVE_SEARCH:
			return assign({}, state, {
				search: action.searchString,
			});
		case SET_ACTIVE_SORT:
			return assign({}, state, {
				sort: action.sort,
			});
		case SET_ACTIVE_COLUMNS:
			return assign({}, state, {
				columns: action.columns,
			});
		case ADD_FILTER:
			return assign({}, state, {
				// Override existing filter with field path,
				// otherwise add to filters array
				filters: _.unionWith([action.filter], state.filters, (stateFilter, actionFilter) => {
					return stateFilter.field.path === actionFilter.field.path;
				}),
			});
		case SET_FILTERS:
			return assign({}, state, {
				filters: action.filters,
			});
		case CLEAR_FILTER:
			let newFilters = _.filter(state.filters, (filter) => {
				return filter.field.path !== action.path;
			});
			return assign({}, state, {
				filters: newFilters,
			});
		case CLEAR_ALL_FILTERS:
			return assign({}, state, {
				filters: [],
			});
		default:
			return state;
	}
}

export default active;
