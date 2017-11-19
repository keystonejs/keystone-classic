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
			// Remove the current version from revisions
			const shifted = action.payload.shift();
			const currentItem = shifted.data || shifted.d;
			return { ...state, revisions: action.payload, error: null, ready: true, currentItem };
		case DATA_LOADING_ERROR:
			if (action.payload) {
				return { ...state, ready: true, error: `No item matching id ${action.payload}` };
			}
			return { ...state, ready: true, error: 'Get Revisions Failed. Ensure you have history:true in your model options.' };
		case SELECT_REVISION:
			return { ...state, selectedRevision: action.payload };
		default:
			return state;
	}
};
