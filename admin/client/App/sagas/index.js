import { takeLatest, delay } from 'redux-saga';
import { fork, select, put, take } from 'redux-saga/effects';

import * as actions from '../screens/List/constants';
import updateParams from './updateParams';
import { loadItems } from '../screens/List/actions';

/**
 * Load the items
 */
function * loadTheItems () {
	yield put(loadItems());
	yield updateParams();
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

function * rootSaga () {
	// Block loading on all items until the first load comes in
	yield take(actions.INITIAL_LIST_LOAD);
	yield put(loadItems());
	// Search debounced
	yield fork(takeLatest, actions.SET_ACTIVE_SEARCH, debouncedSearch);
	// If one of the other active properties changes, update the query params and load the new items
	yield fork(takeLatest, [
		actions.SET_ACTIVE_SORT,
		actions.SET_ACTIVE_COLUMNS,
		actions.SET_CURRENT_PAGE,
		actions.SET_ACTIVE_LIST,
		actions.ADD_FILTER,
		actions.CLEAR_FILTER,
		actions.CLEAR_ALL_FILTERS,
	], updateParams);
	// Whenever another list is loaded, load the items
	yield fork(takeLatest, [actions.INITIAL_LIST_LOAD], loadTheItems);
}

export default rootSaga;
