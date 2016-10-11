import {
	LOAD_USER_ABILITIES,
	USER_ABILITIES_LOADING_SUCCESS,
	USER_ABILITIES_LOADING_ERROR,
} from './constants';


const initialState = {
	loading: false,
	error: null,
	abilities: [],
};

export default function userAbilities (state = initialState, action) {
	switch (action.type) {
		case LOAD_USER_ABILITIES:
			return Object.assign({}, state, {
				loading: true,
			});
		case USER_ABILITIES_LOADING_SUCCESS:
			return Object.assign({}, state, {
				loading: false,
				abilities: action.abilities,
				error: null,
			});
		case USER_ABILITIES_LOADING_ERROR:
			console.log(action.error);
			return Object.assign({}, state, {
				loading: false,
				error: action.error,
			});
		default:
			return state;
	}
}
