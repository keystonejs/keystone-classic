import {
	LOAD_COUNTS,
	COUNTS_LOADING_SUCCESS,
	COUNTS_LOADING_ERROR,
} from './constants';

const initialState = {
	counts: {},
	loading: false,
};

function home (state = initialState, action) {
	switch (action.type) {
		case LOAD_COUNTS:
			return Object.assign({}, state, {
				loading: true,
			});
		case COUNTS_LOADING_SUCCESS:
			return Object.assign({}, state, {
				loading: false,
				counts: action.counts,
			});
		case COUNTS_LOADING_ERROR:
			// TODO Error handling
			return Object.assign({}, state, {
				loading: false,
			});
		default:
			return state;
	}
}

export default home;
