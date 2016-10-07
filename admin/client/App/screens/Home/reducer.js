import {
	LOAD_COUNTS,
	COUNTS_LOADING_SUCCESS,
	COUNTS_LOADING_ERROR,
	LOAD_USER_ABILITIES,
	USER_ABILITIES_LOADING_SUCCESS,
	USER_ABILITIES_LOADING_ERROR
} from './constants';

const initialState = {
	counts: {},
	loading: false,
	error: null,
	user_abilities: []
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
				error: null,
			});
		case COUNTS_LOADING_ERROR:
			console.log(action.error);
			return Object.assign({}, state, {
				loading: false,
				error: action.error,
			});
		case LOAD_USER_ABILITIES:
			return Object.assign({}, state, {
				loading: true,
			});
		case USER_ABILITIES_LOADING_SUCCESS:
			return Object.assign({}, state, {
				loading: false,
				user_abilities: action.abilities,
				error: null
			});
		case USER_ABILITIES_LOADING_ERROR:
			console.log(action.error);
			return Object.assign({}, state, {
				loading: false,
				error: action.error
			});
		default:
			return state;
	}
}

export default home;
