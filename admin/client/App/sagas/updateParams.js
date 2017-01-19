import { updateQueryParams, stringifyColumns, parametizeFilters } from '../../utils/queryParams';
import { replace } from 'react-router-redux';
import { select, put } from 'redux-saga/effects';
import {
	loadItems,
} from '../screens/List/actions';

/**
 * Update the query params based on the current state
 */
export default function * updateParams () {
	// Select all the things
	const activeState = yield select((state) => state.active);
	const currentList = yield select((state) => state.lists.currentList);
	const location = yield select((state) => state.routing.locationBeforeTransitions);
	let page = yield select((state) => state.lists.page.index);

	// Get the data into the right format, set the defaults
	let sort = activeState.sort.rawInput;
	if (sort === currentList.defaultSort) sort = undefined;
	let columns = stringifyColumns(activeState.columns, currentList.defaultColumnPaths);
	let search = activeState.search;
	let filters = parametizeFilters(activeState.filters);
	if (page === 1) page = undefined;

	const newParams = updateQueryParams({
		page,
		columns,
		sort,
		search,
		filters,
	}, location);

	// TODO: Starting or clearing a search pushes a new history state, but updating
	// the current search replaces it for nicer history navigation support
	yield put(replace({
		pathname: location.pathname,
		query: newParams,
	}));
	yield put(loadItems());
}
