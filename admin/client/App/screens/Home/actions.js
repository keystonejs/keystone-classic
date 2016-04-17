import xhr from 'xhr';
import {
	LOAD_COUNTS,
	COUNTS_LOADING_SUCCESS,
	COUNTS_LOADING_ERROR,
} from './constants';

export function loadCounts () {
	return (dispatch) => {
		dispatch({
			type: LOAD_COUNTS,
		});
		xhr({
			url: `${Keystone.adminPath}/api/counts`,
		}, (err, resp, body) => {
			if (err) {
				dispatch(countsLoadingError(err));
				return;
			}
			try {
				body = JSON.parse(body);
				if (body.counts) {
					dispatch(countsLoaded(body.counts));
				}
			} catch (e) {
				console.log('Error parsing results json:', e, body);
				dispatch(countsLoadingError(e));
				return;
			}
		});
	};
}

export function countsLoaded (counts) {
	return {
		type: COUNTS_LOADING_SUCCESS,
		counts,
	};
}

export function countsLoadingError (error) {
	return {
		type: COUNTS_LOADING_ERROR,
		error,
	};
}
