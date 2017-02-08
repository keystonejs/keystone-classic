import { setActiveColumnsSaga, setActiveSortSaga, setActiveFilterSaga } from '../index';
import { filterParser, sortParser, columnsParser } from '../../parsers/index';
import demand from 'must';
import * as actions from '../../screens/List/constants.js';
import { take, call } from 'redux-saga/effects';
//
describe('<List/> sagas', function () {
	beforeEach(function () {
		this.state = {
			lists: {
				currentList: {
					someKey: 'someValue',
				},
			},
			active: {
				filters: ['This is a filter', 'this is anotehr filter'],
			},
		};
	});

	describe('* setActiveFilterSaga()', function () {
		describe('Given a SELECT_FILTER action', function () {
			it('puts an object to the store with the type ADD_FILTER', function () {
				const generator = setActiveFilterSaga();
				const state = this.state;
				const action = {
					type: actions.SELECT_FILTER,
					filter: { path: 'name' },
				};

				let next = generator.next(action);
				demand(next.value).eql(take(action.type));

				next = generator.next(action);
				demand(next.value.SELECT.selector(state)).eql(state.lists);

				next = generator.next(state.lists);
				demand(next.value.SELECT.selector(state)).eql(state.active.filters);

				next = generator.next(state.active.filters);
				const expectedEffect = call(filterParser, action.filter, state.active.filters, state.lists.currentList);
				demand(next.value).eql(expectedEffect);

				next = generator.next(action.filter);
				demand(next.value.PUT.action.type).eql(actions.ADD_FILTER);
			});
		});
	});

	describe('* setActiveSortSaga()', function () {
		describe('Given a SELECT_ACTIVE_SORT action', function () {
			it('puts an object to the store with the type SET_ACTIVE_SORT', function () {
				const generator = setActiveColumnsSaga();
				const state = this.state;
				const action = {
					type: actions.SELECT_ACTIVE_COLUMNS,
					columns: ['columnA', 'columnB'],
				};

				let next = generator.next(action);
				demand(next.value).eql(take(action.type));

				next = generator.next(action);
				demand(next.value.SELECT.selector(state)).eql(state.lists);

				next = generator.next(state.lists);
				const expectedEffect = call(columnsParser, action.columns, state.lists.currentList);
				demand(next.value).eql(expectedEffect);

				next = generator.next(action.columns);
				demand(next.value.PUT.action.type).eql(actions.SET_ACTIVE_COLUMNS);
			});
		});
	});

	describe('* setActiveColumnsSaga', function () {
		describe('Given a SELECT_ACTIVE_COLUMNS action', function () {
			it('puts an object to the store with the type SET_ACTIVE_COLUMNS', function () {
				const generator = setActiveSortSaga();
				const state = this.state;
				const action = {
					type: actions.SELECT_ACTIVE_SORT,
					path: '-name',
				};

				let next = generator.next(action);
				demand(next.value).eql(take(action.type));

				next = generator.next(action);
				demand(next.value.SELECT.selector(state)).eql(state.lists);

				next = generator.next(state.lists);
				const expectedEffect = call(sortParser, action.path, state.lists.currentList);
				demand(next.value).eql(expectedEffect);

				next = generator.next(action.columns);
				demand(next.value.PUT.action.type).eql(actions.SET_ACTIVE_SORT);
			});
		});
	});
});
