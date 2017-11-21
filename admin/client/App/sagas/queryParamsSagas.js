import { updateQueryParams, stringifyColumns, parametizeFilters, createSortQueryParams, createPageQueryParams } from '../../utils/queryParams';
import { replace, push } from 'react-router-redux';
import { select, put, call } from 'redux-saga/effects';
import blacklist from 'blacklist';

import * as actions from '../screens/List/constants';

import { loadItems } from '../screens/List/actions';

import isEqual from 'lodash/isEqual';
import { columnsParser, sortParser, filtersParser } from '../parsers';

export function * urlUpdate (query, cache, pathname) {
	const blacklistedField = 'search';
	const attenuatedQuery = blacklist(query, blacklistedField);
	const attenuatedCache = blacklist(cache, blacklistedField);
	if (!isEqual(attenuatedQuery, attenuatedCache)) {
		yield put(push({
			pathname,
			query,
		}));
	} else {
		yield put(replace({
			pathname,
			query,
		}));
	}
}
/**
 * Update the query params based on the current state
 */
export function * updateParams () {
	// Select all the things
	const activeState = yield select((state) => state.active);
	const currentList = yield select((state) => state.lists.currentList);
	const location = yield select((state) => state.routing.locationBeforeTransitions);
	const { index } = yield select((state) => state.lists.page);

	// Get the data into the right format, set the defaults
	let sort = createSortQueryParams(activeState.sort.rawInput, currentList.defaultSort);
	let page = createPageQueryParams(index, 1);

	let columns = stringifyColumns(activeState.columns, currentList.defaultColumnPaths);
	let search = activeState.search;

	let filters = parametizeFilters(activeState.filters);

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
	yield * urlUpdate(newParams, activeState.cachedQuery, location.pathname);
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
		const parsedQuery = yield call(parseQueryParams, query, currentList);
		yield put({ type: actions.QUERY_HAS_CHANGED, parsedQuery });
	}
}

export function parseQueryParams (query, currentList) {
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
