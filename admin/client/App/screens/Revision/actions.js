import xhr from 'xhr';
import assign from 'object-assign';

import {
	LOAD_REVISIONS,
	DATA_LOADING_SUCCESS,
	DATA_LOADING_ERROR,
	SELECT_REVISION,
} from './constants';

export const loadRevisions = () => {
	return (dispatch, getState) => {
		dispatch({ type: LOAD_REVISIONS });
		const state = getState();
		const { singular, path } = state.lists.currentList;
		const { id } = state.item;
		const url = `${Keystone.adminPath}/api/${path}/${id}/revisions`;
		xhr({
			url,
			method: 'POST',
			headers: assign({}, Keystone.csrf.header),
			json: {
				id,
				list: singular,
			},
		}, (err, resp, body) => {
			if (err) return dispatch({ type: DATA_LOADING_ERROR, payload: err });
			// Pass the body as result or error, depending on the statusCode
			if (resp.statusCode === 200) {
				if (!body.length) {
					dispatch(dataLoadingError(id));
				} else {
					dispatch(dataLoaded(body));
				}
			} else {
				dispatch(dataLoadingError());
			}
		});
	};
};

export const dataLoaded = data => ({
	type: DATA_LOADING_SUCCESS,
	payload: data,
});

export const dataLoadingError = id => ({
	type: DATA_LOADING_ERROR,
	payload: id,
});

export const selectRevision = revision => {
	return (dispatch, getState) => {
		const state = getState();
		const id = state.revisions.selectedRevision._id;
		if (id === revision._id) {
			dispatch({ type: SELECT_REVISION, payload: {} });
		} else {
			dispatch({ type: SELECT_REVISION, payload: revision });
		}
	};
};

export const applyChanges = router => {
	return (dispatch, getState) => {
		const state = getState();
		const { selectedRevision } = state.revisions;
		const { currentList } = state.lists;
		const { id } = state.item;
		const data = selectedRevision.data || selectedRevision.d;
		const { _id: rollbackId } = selectedRevision;
		const { currentItem } = state.revisions;
		const redirectUrl = `${Keystone.adminPath}/${currentList.path}/${id}`;
		const file = {
			filename: data.filename,
			mimetype: data.mimetype,
			path: data.path,
			originalname: data.originalname,
			size: data.size,
			url: data.url,
		};
		data.filename ? data.file = file : data.file = ''; // empty string to rollback to no file
		// this is to account for text fields being undefined upon entry creation
		for (const k in currentItem) {
			if (!data[k]) data[k] = '';
		}
		// delete target revision to prevent a clog of revisions of the same type
		xhr({
			url: `${Keystone.adminPath}/api/${currentList.singular}/${rollbackId}/delete/revision`,
			method: 'POST',
			headers: assign({}, Keystone.csrf.header),
		}, () => {
			currentList.updateItem(id, data, (err, data) => {
				// TODO proper error handling
				dispatch({ type: SELECT_REVISION, payload: {} });
				router.push(redirectUrl);
			});
		});
	};
};
