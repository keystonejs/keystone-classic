import { SAVE_DATA } from '../constants/ActionTypes';

export function saveData(text) {
	return {
		type: SAVE_DATA,
		text
	};
}
