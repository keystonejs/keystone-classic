require('babel-polyfill');

import demand from 'must';
import { evalQueryParams, updateParams, parseQueryParams, urlUpdate } from '../queryParamsSagas';

import { put, call } from 'redux-saga/effects';
import * as actions from '../../screens/List/constants.js';
import { replace, push } from 'react-router-redux';

describe('<List /> query param sagas', function () {
	describe('* urlUpdate()', function () {
		describe('Given a query object and a cache object', function () {
			describe('If the query object sans search, is the same as the cache object sans search', function () {
				it('puts the result of replace called with the passed in pathname and query as arguments', function () {
					const query = {
						filter: [],
						columns: [],
						search: 'hello',
					};
					const cache = {
						filter: [],
						columns: [],
						search: 'hello',
					};
					const pathname = '/somePath';
					const generator = urlUpdate(query, cache, pathname);
					const expectedResult = put(replace({
						pathname,
						query,
					}));
					let next = generator.next();
					demand(next.value).eql(expectedResult);
				});
			});
			describe('If the query object sans search, is different from the cache object sans search', function () {
				it('puts the result of push called with the passed in pathname and query as arguments', function () {
					const query = {
						filter: [],
						columns: [],
						search: 'hello',
					};
					const cache = {
						filter: ['some filter'],
						columns: ['some columns'],
						search: 'hello',
					};
					const pathname = '/somePath';
					const generator = urlUpdate(query, cache, pathname);
					const expectedResult = put(push({ pathname, query }));
					let next = generator.next();
					demand(next.value).eql(expectedResult);
				});
			});
		});

	});
	describe('* updateParams()', function () {
		beforeEach(function () {
			const currentList = {
				id: 'test-collection',
				defaultSort: '__default__',
				defaultColumnPaths: [],
			};

			const index = 1;
			const size = 100;

			const page = { index, size };
			const pathname = `/keystone/${currentList.id}`;
			const query = {};
			const location = { pathname, query };

			const locationBeforeTransitions = { location };
			const active = {
				columns: '',
				search: 'test search term',
				filters: [],
				sort: '__defaultSort__',
			};

			this.newQuery = {
				search: active.search,
			};

			this.state = {
				active,
				lists: {
					currentList,
					page,
				},
				routing: {
					locationBeforeTransitions,
				},
			};
		});

		it('puts REPLACE_CACHED_QUERY with a new query object to the store', function () {
			const generator = updateParams();
			const { state, newQuery } = this;

			let next = generator.next();
			demand(next.value.SELECT.selector(state)).eql(state.active);

			next = generator.next(state.active);
			demand(next.value.SELECT.selector(state)).eql(state.lists.currentList);

			next = generator.next(state.lists.currentList);
			demand(next.value.SELECT.selector(state)).eql({ location: state.routing.locationBeforeTransitions.location });

			next = generator.next(state.routing.locationBeforeTransitions.location);
			demand(next.value.SELECT.selector(state)).eql(state.lists.page);

			next = generator.next(state.lists.page.index);
			demand(next.value).eql(put({ type: actions.REPLACE_CACHED_QUERY, cachedQuery: newQuery }));
		});

		it('puts a new url to the store, by location.pathname and our new query object into react-router-redux replace', function () {
			const generator = updateParams();
			const { state, newQuery } = this;
			const { location } = state.routing.locationBeforeTransitions;

			let next = generator.next();
			demand(next.value.SELECT.selector(state)).eql(state.active);

			next = generator.next(state.active);
			demand(next.value.SELECT.selector(state)).eql(state.lists.currentList);

			next = generator.next(state.lists.currentList);
			demand(next.value.SELECT.selector(state)).eql({ location });

			next = generator.next(location);
			demand(next.value.SELECT.selector(state)).eql(state.lists.page);

			next = generator.next(state.lists.page.index);
			demand(next.value).eql(put({ type: actions.REPLACE_CACHED_QUERY, cachedQuery: newQuery }));

			next = generator.next();
			demand(next.value).eql(put(replace({ pathname: location.pathname, query: newQuery })));

		});

		it('calls load items');
	});
	describe('* evalQueryParams()', function () {
		describe('If the pathame is is not valid', function () {
			it('bails out', function () {
				const generator = evalQueryParams();
				const pathname = '/keystone/badUrl';
				const query = { query: 'some query' };
				const locationBeforeTransitions = {
					pathname,
					query,
				};
				const currentList = { id: 'Dictators' };

				const cachedQuery = { someKey: 'someValue' };

				const state = {
					routing: { locationBeforeTransitions },
					active: { cachedQuery },
					lists: { currentList },
				};

				let next = generator.next();
				demand(next.value.SELECT.selector(state)).eql({ pathname, query });

				next = generator.next({ pathname, query });
				demand(next.value.SELECT.selector(state)).eql({ cachedQuery });

				next = generator.next({ cachedQuery });
				demand(next.value.SELECT.selector(state)).eql({ currentList });

				next = generator.next({ currentList });
				demand(next.value).eql(undefined);
			});
		});

		describe('If the query and the cached query are the same', function () {
			it('puts a QUERY HAS NOT CHANGED action to the store', function () {
				const generator = evalQueryParams();
				const pathname = '/keystone/Dictators';
				const query = { someKey: 'someValue' };
				const cachedQuery = { someKey: 'someValue' };
				const locationBeforeTransitions = {
					pathname,
					query,
				};

				const currentList = { id: 'Dictators' };
				const state = {
					routing: { locationBeforeTransitions },
					active: { cachedQuery },
					lists: { currentList },
				};

				let next = generator.next();
				demand(next.value.SELECT.selector(state)).eql({ pathname, query });

				next = generator.next({ pathname, query });
				demand(next.value.SELECT.selector(state)).eql({ cachedQuery });

				next = generator.next({ cachedQuery });
				demand(next.value.SELECT.selector(state)).eql({ currentList });

				next = generator.next({ currentList });
				demand(next.value).eql(put({ type: actions.QUERY_HAS_NOT_CHANGED }));
			});
			it('calls load items');
		});

		describe('If the query and the cached query are different', function () {
			it('parses the query and puts QUERY HAS CHANGED to the store', function () {
				const generator = evalQueryParams();
				const pathname = '/keystone/collection';
				const query = { columns: ['name', 'email'], search: 'test search' };
				const parsedQuery = {
					columns: ['name', 'email'],
					search: 'test search',
					filters: [],
					sort: '__default__',
					currentPage: 1,
				};
				const cachedQuery = {};
				const locationBeforeTransitions = {
					pathname,
					query,
				};
				const currentList = {
					id: 'collection',
					expandColumns: columns => columns,
					expandSort: sort => sort,
					defaultColumns: ['name', 'email'],
					defaultSort: '__default__',
				};
				const state = {
					routing: { locationBeforeTransitions },
					active: { cachedQuery },
					lists: { currentList },
				};

				let next = generator.next();
				demand(next.value.SELECT.selector(state)).eql({ pathname, query });

				next = generator.next({ pathname, query });
				demand(next.value.SELECT.selector(state)).eql({ cachedQuery });

				next = generator.next({ cachedQuery });
				demand(next.value.SELECT.selector(state)).eql({ currentList });

				next = generator.next({ currentList });
				demand(next.value).eql(call(parseQueryParams, query, currentList));

				next = generator.next(parsedQuery);
				demand(next.value).eql(put({ type: actions.QUERY_HAS_CHANGED, parsedQuery }));
			});
		});
	});
	describe('parseQueryParams()', function () {
		describe('Given an empty query object and a valid currentList', function () {
			it('returns a valid transformed query object', function () {});
		});
		describe('Given an invalid currentList', function () {
			it('returns a valid transformed query object', function () {});
		});
	});
});
