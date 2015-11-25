import * as ActionTypes from '../constants/ActionTypes';

let defaultState = {
};

export default function(state = defaultState, action) {
	switch (action.type) {
		case ActionTypes.SAVE_DATA:
			return { ...state, text: action.text };
		default:
			return state;
	}
}
