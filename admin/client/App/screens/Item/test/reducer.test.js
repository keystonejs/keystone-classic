import demand from 'must';
import itemReducer from '../reducer';
import {
	SELECT_ITEM,
	LOAD_DATA,
	DATA_LOADING_SUCCESS,
	DATA_LOADING_ERROR,
} from '../constants';

describe('<Item /> reducer', () => {
	it('should return the initial state', () => {
		demand(itemReducer(undefined, {})).eql({
			data: null,
			id: null,
			loading: false,
			ready: false,
			error: null,
			relationshipData: {},
			drag: {
				clonedItems: false,
				newSortOrder: null,
				relationshipPath: false,
			},
		});
	});

	describe('SELECT_ITEM', () => {
		const state = {
			data: { some: 'data' },
			id: null,
			loading: false,
			ready: true,
			error: null,
		};

		it('should set ready to false', () => {
			demand(itemReducer(state, {
				type: SELECT_ITEM,
			}).ready).false();
		});

		it('should set id to the passed id', () => {
			const id = 'someID';
			demand(itemReducer(state, {
				type: SELECT_ITEM,
				id,
			}).id).eql(id);
		});

		it('should set data to null', () => {
			demand(itemReducer(state, {
				type: SELECT_ITEM,
			}).data).null();
		});
	});

	describe('LOAD_DATA', () => {
		const state = {
			data: null,
			id: null,
			loading: false,
			ready: false,
			error: null,
		};

		it('should set loading to true', () => {
			demand(itemReducer(state, {
				type: LOAD_DATA,
			}).loading).true();
		});
	});

	describe('DATA_LOADING_SUCCESS', () => {
		const state = {
			data: null,
			id: null,
			loading: true,
			ready: false,
			error: null,
		};

		it('should set loading to false', () => {
			demand(itemReducer(state, {
				type: DATA_LOADING_SUCCESS,
			}).loading).false();
		});

		it('should set ready to true', () => {
			demand(itemReducer(state, {
				type: DATA_LOADING_SUCCESS,
			}).ready).true();
		});

		it('should set error to null', () => {
			demand(itemReducer(state, {
				type: DATA_LOADING_SUCCESS,
			}).error).null();
		});

		it('should set data to the passed data', () => {
			const data = { some: 'data' };
			demand(itemReducer(state, {
				type: DATA_LOADING_SUCCESS,
				data,
			}).data).eql(data);
		});
	});

	describe('DATA_LOADING_ERROR', () => {
		const state = {
			data: null,
			id: null,
			loading: true,
			ready: false,
			error: null,
		};

		it('should set loading to false', () => {
			demand(itemReducer(state, {
				type: DATA_LOADING_ERROR,
			}).loading).false();
		});

		it('should set ready to true', () => {
			demand(itemReducer(state, {
				type: DATA_LOADING_ERROR,
			}).ready).true();
		});

		it('should set data to null', () => {
			demand(itemReducer(state, {
				type: DATA_LOADING_ERROR,
			}).data).null();
		});

		it('should set error to the passed error', () => {
			const error = { some: 'error' };
			demand(itemReducer(state, {
				type: DATA_LOADING_ERROR,
				error,
			}).error).eql(error);
		});
	});
});
