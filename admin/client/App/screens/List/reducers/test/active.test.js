import demand from 'must';
import sinon from 'sinon';
import {
	SET_ACTIVE_LIST,
	SET_ACTIVE_SEARCH,
	SET_ACTIVE_SORT,
	SET_ACTIVE_COLUMNS,
	ADD_FILTER,
	CLEAR_FILTER,
	CLEAR_ALL_FILTERS,
	REPLACE_CACHED_QUERY,
	CLEAR_CACHED_QUERY,
	QUERY_HAS_CHANGED,
} from '../../constants';
import activeReducer from '../active';

describe('<List> reducer active', () => {
	it('should return the initial state by default', () => {
		demand(activeReducer(undefined, {})).eql({
			columns: [],
			filters: [],
			search: '',
			sort: {
				input: '',
				isDefaultSort: false,
				paths: [],
				rawInput: '',
			},
			cachedQuery: {},
		});
	});

	describe('SET_ACTIVE_LIST', () => {
		const list = {
			expandColumns: () => {},
			expandSort: () => {},
		};
		it('should set the id', () => {
			const id = 'asdf1234';
			demand(activeReducer(undefined, {
				type: SET_ACTIVE_LIST,
				id,
				list,
			}).id).eql(id);
		});

		it('should reset the filters', () => {
			demand(activeReducer({
				filters: [{ some: 'filter' }],
			}, {
				type: SET_ACTIVE_LIST,
				list,
			}).filters).eql([]);
		});

		it('should reset the search', () => {
			demand(activeReducer({
				search: 'somesearch',
			}, {
				type: SET_ACTIVE_LIST,
				list,
			}).search).eql('');
		});

		it('should expand the default columns', () => {
			const defaultColumns = 'some|columns';
			const list = {
				expandColumns: sinon.spy(),
				expandSort: sinon.spy(),
				defaultColumns,
			};
			activeReducer(undefined, {
				type: SET_ACTIVE_LIST,
				list,
			});
			demand(list.expandColumns.calledWith(defaultColumns));
		});

		it('should expand the default sort', () => {
			const defaultSort = 'somesort';
			const list = {
				expandColumns: sinon.spy(),
				expandSort: sinon.spy(),
				defaultSort,
			};
			activeReducer(undefined, {
				type: SET_ACTIVE_LIST,
				list,
			});
			demand(list.expandSort.calledWith(defaultSort));
		});
	});

	describe('SET_ACTIVE_SEARCH', () => {
		it('should set the search', () => {
			const searchString = 'somesearch';
			demand(activeReducer(undefined, {
				type: SET_ACTIVE_SEARCH,
				searchString,
			}).search).eql(searchString);
		});
	});

	describe('SET_ACTIVE_SORT', () => {
		it('should set the sort', () => {
			const sort = 'somesort';
			demand(activeReducer(undefined, {
				type: SET_ACTIVE_SORT,
				sort,
			}).sort).eql(sort);
		});
	});

	describe('SET_ACTIVE_COLUMNS', () => {
		it('should set the columns', () => {
			const columns = 'somecolumns';
			demand(activeReducer(undefined, {
				type: SET_ACTIVE_COLUMNS,
				columns,
			}).columns).eql(columns);
		});
	});

	describe('ADD_FILTER', () => {
		it('should add a filter', () => {
			const filter = { some: 'filter', field: {} };
			demand(activeReducer(undefined, {
				type: ADD_FILTER,
				filter,
			}).filters).include(filter);
		});

		it('should add a filter to the existing filters', () => {
			const filter = { some: 'filter', field: { path: 'some/path' } };
			const existingFilter = { some: 'otherfilter', field: { path: 'some/other/path' } };
			demand(activeReducer({
				filters: [existingFilter],
			}, {
				type: ADD_FILTER,
				filter,
			}).filters).include(filter);
			demand(activeReducer({
				filters: [existingFilter],
			}, {
				type: ADD_FILTER,
				filter,
			}).filters).include(existingFilter);
		});

		it('should override a filter with the same field path', () => {
			const path = 'some/path';
			const filter = { some: 'filter', field: { path } };
			const existingFilter = { some: 'otherfilter', field: { path } };
			demand(activeReducer({
				filters: [existingFilter],
			}, {
				type: ADD_FILTER,
				filter,
			}).filters).not.include(existingFilter);
			demand(activeReducer({
				filters: [existingFilter],
			}, {
				type: ADD_FILTER,
				filter,
			}).filters).include(filter);
		});
	});

	describe('CLEAR_FILTER', () => {
		it('should clear nothing if the path doesn\'t exist', () => {
			const filters = [{
				field: {
					path: 'some/other/path',
				},
			}, {
				field: {
					path: 'some/different/path',
				},
			}];
			const nonFilteredPath = 'some/path';
			demand(activeReducer({
				filters,
			}, {
				type: CLEAR_FILTER,
				path: nonFilteredPath,
			}).filters).eql(filters);
		});

		it('should clear a filter', () => {
			const path = 'some/path';
			demand(activeReducer({
				filters: [{
					field: {
						path: 'some/other/path',
					},
				}, {
					field: {
						path,
					},
				}],
			}, {
				type: CLEAR_FILTER,
				path,
			}).filters).eql([{
				field: {
					path: 'some/other/path',
				},
			}]);
		});
	});

	describe('CLEAR_ALL_FILTERS', () => {
		it('should clear all filters', () => {
			demand(activeReducer({
				filters: [{ some: 'filter' }],
			}, {
				type: CLEAR_ALL_FILTERS,
			}).filters).eql([]);
		});
	});

	describe('REPLACE_CACHED_QUERY', function () {
		describe('Given a new cached query object', function () {
			it('Replaces the cachedQuery object in state with the object in the action.', function () {
				const initialState = {
					cachedQuery: {
						filter: ['some cached filter'],
						columns: ['some cached column'],
						sort: 'some cached sort',
					},
				};
				const newCachedQuery = {
					filter: ['New cached filter'],
					columns: ['new cached column'],
				};
				const expectedState = {
					cachedQuery: newCachedQuery,
				};
				const action = { type: REPLACE_CACHED_QUERY, cachedQuery: newCachedQuery };
				demand(activeReducer(initialState, action)).eql(expectedState);
			});
		});
	});

	describe('QUERY_HAS_CHANGED', function () {
		describe('Given a complete new query object', function () {
			it('returns state with new query parameters', function () {
				const initialState = {
					columns: ['name', 'email'],
					filters: ['existing list of filters'],
					sort: 'existing sort method',
					search: 'existing search query',
				};
				const parsedQuery = {
					columns: ['newColA', 'newColB'],
					filters: ['new list of filters'],
					sort: 'new sort method',
					search: 'new search query',
				};
				const expectedState = parsedQuery;
				const action = { type: QUERY_HAS_CHANGED, parsedQuery };
				demand(activeReducer(initialState, action)).eql(expectedState);
			});
		});
		describe('Given a query object with missing or undefined fields', function () {
			beforeEach(function () {
				this.initialState = {
					columns: ['name', 'email'],
					filters: ['existing list of filters'],
					sort: 'existing sort method',
					search: 'existing search query',
				};
				this.parsedQuery = {
					columns: undefined,
					filters: undefined,
					sort: undefined,
					search: 'new search query',
				};
				this.action = { type: QUERY_HAS_CHANGED, parsedQuery: this.parsedQuery };
			});

			it('replaces state with new values for populated fields in the parsedQuery object', function () {
				demand(activeReducer(this.initialState, this.action).search).eql('new search query');
			});

			it('replaces state with assigned default values for undefined fields in the parsedQuery object', function () {
				const defaultSort = {
					input: '',
					isDefaultSort: false,
					paths: [],
					rawInput: '',
				};

				const defaultColumns = [];
				const defaultFilters = [];

				demand(activeReducer(this.initialState, this.action).sort).eql(defaultSort);
				demand(activeReducer(this.initialState, this.action).columns).eql(defaultColumns);
				demand(activeReducer(this.initialState, this.action).filters).eql(defaultFilters);
			});
		});
	});

	describe('CLEAR_CACHED_QUERY', function () {
		it('returns state with an empty cachedQuery object', function () {
			const initialState = {
				cachedQuery: {
					filter: ['some cached filter'],
					columns: ['some cached columns'],
					sort: 'some cached sort',
				},
			};

			const expectedState = {
				cachedQuery: {},
			};

			const action = { type: CLEAR_CACHED_QUERY };
			demand(activeReducer(initialState, action)).eql(expectedState);
		});
	});
});
