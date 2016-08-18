import assign from 'object-assign';
import { replace } from 'react-router-redux';
import { takeLatest, delay } from 'redux-saga';
import { fork, select, put, take } from 'redux-saga/effects';

import {
	SET_ACTIVE_SEARCH,
	SET_ACTIVE_SORT,
	SET_ACTIVE_COLUMNS,
	SET_CURRENT_PAGE,
	ADD_FILTER,
	CLEAR_FILTER,
	CLEAR_ALL_FILTERS,
	INITIAL_LIST_LOAD,
} from '../screens/List/constants';
import {
	loadItems,
} from '../screens/List/actions';

function * updateParams () {
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
	if (page === 1) page = undefined;

	const newParams = updateQueryParams({
		page,
		columns,
		sort,
		search,
	}, location);

	// TODO: Starting or clearing a search pushes a new history state, but updating
	// the current search replaces it for nicer history navigation support
	yield put(replace({
		pathname: location.pathname,
		query: newParams,
	}));
	yield put(loadItems());
}

function * startLoadingItems () {
	yield put(loadItems());
}

function * debouncedSearch () {
	const searchString = yield select((state) => state.active.search);
	if (searchString) {
		yield delay(500);
	}
	yield updateParams();
}

/**
 * Stringify the columns array from the state
 *
 * @param  {Array}  columns            The columns from the active state
 * @param  {String} defaultColumnPaths The default column paths of the current list
 *
 * @return {String}                    The column array, stringified
 */
function stringifyColumns (columns, defaultColumnPaths) {
	if (!columns) {
		return;
	}
	// Turns [{ path: 'someColumn' }, { path: 'someOtherColumn' }]
	// into ['someColumn', 'someOtherColumn']
	let columnString = columns.map((column) => column.path);
	// Turns that array into 'someColumn,someOtherColumn'
	if (Array.isArray(columnString)) columnString = columnString.join(',');
	// If that is the same as the default columns, don't set the query param
	if (columnString === defaultColumnPaths) columnString = undefined;
	return columnString;
}

/**
 * Updates the query parameters with the ones passed as the first argument
 *
 * @param  {Object} params         The new parameters to be added
 * @param  {Object} location       The current location object
 */
function updateQueryParams (params, location) {
	if (!location) return;
	const newParams = assign({}, location.query);
	// Stringify nested objects inside the parameters
	Object.keys(params).forEach(i => {
		if (params[i]) {
			newParams[i] = params[i];
			if (typeof newParams[i] === 'object') {
				newParams[i] = JSON.stringify(newParams[i]);
			}
		} else {
			delete newParams[i];
		}
	});

	return newParams;
}

function * rootSaga () {
	yield take(INITIAL_LIST_LOAD);
	yield put(loadItems());
	yield fork(takeLatest, SET_ACTIVE_SEARCH, debouncedSearch);
	yield fork(takeLatest, SET_ACTIVE_SORT, updateParams);
	yield fork(takeLatest, SET_ACTIVE_COLUMNS, updateParams);
	yield fork(takeLatest, SET_CURRENT_PAGE, updateParams);
	yield fork(takeLatest, ADD_FILTER, startLoadingItems);
	yield fork(takeLatest, CLEAR_FILTER, startLoadingItems);
	yield fork(takeLatest, CLEAR_ALL_FILTERS, startLoadingItems);
}

export default rootSaga;
