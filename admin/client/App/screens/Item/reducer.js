/**
 * Item reducer, handles the item data and loading
 */
import assign from 'object-assign';
import {
	SELECT_ITEM,
	LOAD_DATA,
	DATA_LOADING_SUCCESS,
	DATA_LOADING_ERROR,
	LOAD_RELATIONSHIP_DATA,
} from './constants';

const initialState = {
	data: null,
	id: null,
	loading: false,
	ready: false,
	error: null,
	relationshipData: {},
};

function item (state = initialState, action) {
	switch (action.type) {
		case SELECT_ITEM:
			return assign({}, state, {
				ready: false,
				id: action.id,
				data: null,
			});
		case LOAD_DATA:
			return assign({}, state, {
				loading: true,
			});
		case DATA_LOADING_SUCCESS:
			return assign({}, state, {
				data: action.data,
				loading: false,
				ready: true,
				error: null,
			});
		case DATA_LOADING_ERROR:
			return assign({}, state, {
				data: null,
				loading: false,
				ready: true,
				error: action.error,
			});
		case LOAD_RELATIONSHIP_DATA:
			return assign({}, state, {
				relationshipData: {
					...state.relationshipData,
					[action.relationshipPath]: action.data,
				},
			});
		default:
			return state;
	}
}

export default item;
