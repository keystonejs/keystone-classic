import {
	LOAD_REVISIONS,
	DATA_LOADING_SUCCESS,
	DATA_LOADING_ERROR,
	SELECT_REVISION,
} from './constants';

export default (state = {
	revisions: [],
	currentItem: {},
	selectedRevision: {},
	error: null,
	ready: false,
}, action) => {
	switch (action.type) {
		case LOAD_REVISIONS:
			return { ...state, error: null, ready: false };
		case DATA_LOADING_SUCCESS:
			const popped = action.payload.pop();
			const currentItem = popped.data || popped.d;
			return { ...state, revisions: action.payload, error: null, ready: true, currentItem };
		case DATA_LOADING_ERROR:
			if (action.payload) {
				return { ...state, ready: true, error: `No item matching id ${action.payload}` };
			}
			return { ...state, ready: true, error: 'Query error' };
		case SELECT_REVISION:
			return { ...state, selectedRevision: action.payload };
		default:
			return state;
	}
};
