import demand from 'must';
import homeReducer from '../reducer';
import {
	LOAD_COUNTS,
	COUNTS_LOADING_SUCCESS,
	COUNTS_LOADING_ERROR,
} from '../constants';

describe('<Home /> reducer', () => {
	it('should return the initial state', () => {
		demand(homeReducer(undefined, {})).eql({
			counts: {},
			loading: false,
			error: null,
		});
	});

	it('should set loading to true when LOAD_COUNTS comes in', () => {
		demand(homeReducer(undefined, {
			type: LOAD_COUNTS,
		}).loading).true();
	});

	it('should set loading to false when COUNTS_LOADING_SUCCESS comes in', () => {
		const state = {
			counts: {},
			loading: true,
			error: null,
		};
		demand(homeReducer(state, {
			type: COUNTS_LOADING_SUCCESS,
		}).loading).false();
	});

	it('should set error to null when COUNTS_LOADING_SUCCESS comes in', () => {
		const state = {
			counts: {},
			loading: true,
			error: 'something',
		};
		demand(homeReducer(state, {
			type: COUNTS_LOADING_SUCCESS,
		}).error).null();
	});

	it('should set counts to counts when COUNTS_LOADING_SUCCESS comes in', () => {
		const state = {
			counts: {},
			loading: true,
			error: 'something',
		};
		const counts = { 'some/list': 100 };
		demand(homeReducer(state, {
			type: COUNTS_LOADING_SUCCESS,
			counts,
		}).counts).eql(counts);
	});

	it('should set error to error when COUNTS_LOADING_ERROR comes in', () => {
		const state = {
			counts: {},
			loading: true,
			error: null,
		};
		const error = { code: 404 };
		demand(homeReducer(state, {
			type: COUNTS_LOADING_ERROR,
			error,
		}).error).eql(error);
	});

	it('should set loading to false when COUNTS_LOADING_ERROR comes in', () => {
		const state = {
			counts: {},
			loading: true,
			error: null,
		};
		const error = { code: 404 };
		demand(homeReducer(state, {
			type: COUNTS_LOADING_ERROR,
			error,
		}).loading).eql(false);
	});
});
