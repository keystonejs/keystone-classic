import { takeLatest, delay } from 'redux-saga';
import { fork, select, put, take } from 'redux-saga/effects';
import updateParams from './updateParams';

import { loadItems } from '../screens/List/actions';

/**
 * Load the items
 */
function * loadTheItems () {
	yield put(loadItems());
}

/**
 * Debounce the search loading new items by 500ms
 */
function * debouncedSearch () {
	const searchString = yield select((state) => state.active.search);
	if (searchString) {
		yield delay(500);
	}
	yield updateParams();
}

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

function * rootSaga () {
	yield take(INITIAL_LIST_LOAD);
	yield put(loadItems());
	yield fork(takeLatest, SET_ACTIVE_SEARCH, debouncedSearch);
	yield fork(takeLatest, SET_ACTIVE_SORT, updateParams);
	yield fork(takeLatest, SET_ACTIVE_COLUMNS, updateParams);
	yield fork(takeLatest, SET_CURRENT_PAGE, updateParams);
	yield fork(takeLatest, ADD_FILTER, loadTheItems);
	yield fork(takeLatest, CLEAR_FILTER, loadTheItems);
	yield fork(takeLatest, CLEAR_ALL_FILTERS, loadTheItems);
}

export default rootSaga;
