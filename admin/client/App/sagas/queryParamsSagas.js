import { updateQueryParams, stringifyColumns, parametizeFilters } from '../../utils/queryParams';
import { replace } from 'react-router-redux';
import { select, put } from 'redux-saga/effects';

import * as actions from '../screens/List/constants';

import { loadItems } from '../screens/List/actions';

import isEqual from 'lodash/isEqual';
import { columnsParser, sortParser, filtersParser } from '../parsers';

/**
 * Update the query params based on the current state
 */
export function * updateParams () {
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

	yield put({ type: actions.REPLACE_CACHED_QUERY, cachedQuery: newParams });
	yield put(replace({
		pathname: location.pathname,
		query: newParams,
	}));

	yield put(loadItems());
}


export function * evalQueryParams () {
	const { pathname, query } = yield select(state => state.routing.locationBeforeTransitions);
	const { cachedQuery } = yield select(state => state.active);
	const { currentList } = yield select(state => state.lists);

	if (pathname !== `/keystone/${currentList.id}`) return;

	if (isEqual(query, cachedQuery)) {
		yield put({ type: actions.QUERY_HAS_NOT_CHANGED });
		yield put(loadItems());
	} else {
		const parsedQuery = parseQueryParams(query, currentList);
		yield put({ type: actions.QUERY_HAS_CHANGED, parsedQuery });
	}
}

export function parseQueryParams (query, currentList) {
	console.log(query);
	const columns = columnsParser(query.columns, currentList);
	const sort = sortParser(query.sort, currentList);
	const filters = filtersParser(query.filters, currentList);
	const currentPage = query.page || 1;
	const search = query.search || '';

	return {
		columns,
		sort,
		filters,
		currentPage,
		search,
	};
}
