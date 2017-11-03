import demand from 'must';
import revisionReducer from '../reducer';
import {
	LOAD_REVISIONS,
	DATA_LOADING_SUCCESS,
	DATA_LOADING_ERROR,
	SELECT_REVISION,
} from '../constants';

describe('<Revision /> reducer', () => {
	it('should return the initial state', () => {
		demand(revisionReducer(undefined, {})).eql({
			revisions: [],
			currentItem: {},
			selectedRevision: {},
			error: null,
			ready: false,
		});
	});

	describe('LOAD_REVISIONS', () => {
		const state = {
			error: {},
			ready: true,
		};

		it('should set ready to false', () => {
			demand(revisionReducer(state, {
				type: LOAD_REVISIONS,
			}).ready).false();
		});

		it('should set error to null', () => {
			demand(revisionReducer(state, {
				type: LOAD_REVISIONS,
			}).error).eql(null);
		});
	});

	describe('DATA_LOADING_SUCCESS', () => {
		const state = {
			revisions: [],
			currentItem: {},
			error: null,
			ready: false,
		};

		it('should set revisions to the data passed in except for the last item', () => {
			demand(revisionReducer(state, {
				type: DATA_LOADING_SUCCESS,
				payload: ['some', 'revisions'],
			}).revisions).eql(['some']);
		});

		it('should set currentItem to the last item of the data passed in', () => {
			demand(revisionReducer(state, {
				type: DATA_LOADING_SUCCESS,
				payload: ['some', { data: 'item' }],
			}).currentItem).eql('item');
		});
	});

	describe('DATA_LOADING_ERROR', () => {
		const state = {
			error: null,
		};

		it('should set error to the error object passed in', () => {
			demand(revisionReducer(state, {
				type: DATA_LOADING_ERROR,
				payload: 'foobar',
			}).error).eql('No item matching id foobar');
		});
	});

	describe('SELECT_REVISION', () => {
		const state = {
			selectedRevision: {},
		};

		it('should set the selectedRevision to the data passed in', () => {
			demand(revisionReducer(state, {
				type: SELECT_REVISION,
				payload: { some: 'revision' },
			}).selectedRevision).eql({ some: 'revision' });
		});
	});
});
