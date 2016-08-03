import {
	LOAD_ITEMS,
	ITEMS_LOADED,
	ITEM_LOADING_ERROR,
} from '../constants';

import {
	deleteItem,
} from '../../Item/actions';
import { NETWORK_ERROR_RETRY_DELAY } from '../../../../constants';

export function loadItems (options = {}) {
	return (dispatch, getState) => {
		// Crete an empty object to reference a point in memory.
		// Dispatch this reference to our redux store to hold on to as a 'loadingRef'.
		const thisLoadRef = {};
		dispatch({
			type: LOAD_ITEMS,
			loadingRef: thisLoadRef,
		});
		const state = getState();
		const currentList = state.lists.currentList;

		currentList.loadItems({
			search: state.active.search,
			filters: state.active.filters,
			sort: state.active.sort,
			columns: state.active.columns,
			page: state.lists.page,
		}, (err, items) => {

			// Once this async request has fired this callback, check that
			// the point in memory referenced by thisLoadRef is the same point in memory
			// referenced by loadingRef in the redux store.

			// If it is, then this is the latest request, and it is safe to resolve it normally.
			// If it is not a reference the same point in memory however,
			// this means that this request is NOT the latest fired request,
			// and so we'll bail out of it early.

			if (getState().lists.loadingRef !== thisLoadRef) return;
			if (items) {
				// if (page.index !== drag.page && drag.item) {
				// 	// add the dragging item
				// 	if (page.index > drag.page) {
				// 		_items.results.unshift(drag.item);
				// 	} else {
				// 		_items.results.push(drag.item);
				// 	}
				// }
				// _itemsResultsClone = items.results.slice(0);
				//

				// TODO Reenable this
				// if (options.success && options.id) {
				// 	// flashes a success background on the row
				// 	_rowAlert.success = options.id;
				// }
				// if (options.fail && options.id) {
				// 	// flashes a failure background on the row
				// 	_rowAlert.fail = options.id;
				// }
				dispatch(itemsLoaded(items));
			} else {
				dispatch(itemLoadingError(err));
			}
		});
	};
}

export function downloadItems (format, columns) {
	return (dispatch, getState) => {
		const state = getState();
		const active = state.active;
		const currentList = state.lists.currentList;
		const url = currentList.getDownloadURL({
			search: active.search,
			filters: active.filters,
			sort: active.sort,
			columns: columns ? currentList.expandColumns(columns) : active.columns,
			format: format,
		});
		window.open(url);
	};
}

export function itemsLoaded (items) {
	return {
		type: ITEMS_LOADED,
		items,
	};
}

/**
 * Dispatched when unsuccessfully trying to load the items, will redispatch
 * loadItems after NETWORK_ERROR_RETRY_DELAY milliseconds until we get items back
 */
export function itemLoadingError () {
	return (dispatch) => {
		dispatch({
			type: ITEM_LOADING_ERROR,
			err: 'Network request failed',
		});
		setTimeout(() => {
			dispatch(loadItems());
		}, NETWORK_ERROR_RETRY_DELAY);
	};
}

export function deleteItems (ids) {
	return (dispatch, getState) => {
		for (var i = 0; i < ids.length; i++) {
			dispatch(deleteItem(ids[i]));
		}
	};
}
