import xhr from 'xhr';
import {
	LOAD_USER_ABILITIES,
	USER_ABILITIES_LOADING_SUCCESS,
	USER_ABILITIES_LOADING_ERROR,
} from './constants';
import { NETWORK_ERROR_RETRY_DELAY } from '../../constants';

/**
 * Load the current user List to be managed
 */
export function loadUserAbilities () {
	return (dispatch) => {
		dispatch({
			type: LOAD_USER_ABILITIES,
		});
		xhr({
			url: `${Keystone.adminPath}/api/user_abilities`,
		}, (err, resp, body) => {
			if (err) {
				dispatch(abilitiesLoadingError(err));
				return;
			}
			try {
				body = JSON.parse(body);
				if (body.abilities) {
					dispatch(abilitiesLoaded(body.abilities));
				}
			} catch (e) {
				console.log('Error parsing results json:', e, body);
				dispatch(abilitiesLoadingError(e));
				return;
			}
		});
	};
}

export function abilitiesLoaded (abilities) {
	return {
		type: USER_ABILITIES_LOADING_SUCCESS,
		abilities,
	};
}

export function abilitiesLoadingError (error) {
	return (dispatch, getState) => {
		dispatch({
			type: USER_ABILITIES_LOADING_ERROR,
			error,
		});
		setTimeout(() => {
			dispatch(loadUserAbilities());
		}, NETWORK_ERROR_RETRY_DELAY);
	};
}
