import {
	LOAD_ITEMS,
	ITEMS_LOADED,
	ITEM_LOADING_ERROR,
	DELETE_ITEM,
} from '../constants';

export function loadItems (options = {}) {
	return (dispatch, getState) => {
		dispatch({ type: LOAD_ITEMS });
		const state = getState();
		const currentList = state.lists.currentList;
		currentList.loadItems({
			search: state.active.search,
			filters: state.active.filters,
			sort: state.active.sort,
			columns: state.active.columns,
			page: state.lists.page,
		}, (err, items) => {
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

export function itemLoadingError (err) {
	return {
		type: ITEM_LOADING_ERROR,
		err,
	};
}

export function deleteItem (id, router) {
	return (dispatch, getState) => {
		const list = getState().lists.currentList;
		list.deleteItem(id, (err) => {
			// If a router is passed, redirect to the current list path,
			// otherwise stay where we are
			if (router) {
				router.push(`${Keystone.adminPath}/${list.path}`);
			}
			// TODO Proper error handling
			if (err) {
				alert('Error deleting item, please try again!');
				console.log(err);
			} else {
				dispatch({
					type: DELETE_ITEM,
					id,
				});
			}
		});
	};
}

export function deleteItems (ids) {
	return (dispatch, getState) => {
		for (var i = 0; i < ids.length; i++) {
			dispatch(deleteItem(ids[i]));
		}
	};
}
