/**
 * Item reducer, handles the item data and loading
 */

import {
	SELECT_ITEM,
	LOAD_DATA,
	DATA_LOADING_SUCCESS,
	DATA_LOADING_ERROR,
} from './constants';

const initialState = {
	data: null,
	id: null,
	loading: false,
	ready: false,
	error: null,
};

function item (state = initialState, action) {
	switch (action.type) {
		case SELECT_ITEM:
			return Object.assign({}, state, {
				ready: false,
				id: action.id,
				data: null,
			});
		case LOAD_DATA:
			return Object.assign({}, state, {
				loading: true,
			});
		case DATA_LOADING_SUCCESS:
			return Object.assign({}, state, {
				data: action.data,
				loading: false,
				ready: true,
				error: null,
			});
		case DATA_LOADING_ERROR:
			return Object.assign({}, state, {
				data: null,
				loading: false,
				ready: true,
				error: action.error,
			});
		default:
			return state;
	}
}

export default item;
