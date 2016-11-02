import {
	SET_ROW_ALERT,
	RESET_DRAG_PAGE,
	RESET_DRAG_ITEMS,
	SET_DRAG_ITEM,
	SET_DRAG_INDEX,
	DRAG_MOVE_ITEM,
} from '../constants';

import {
	setCurrentPage,
	itemsLoaded,
	loadItems,
} from '../actions';

export function setDragBase (item, index) {
	return (dispatch) => {
		dispatch(resetDragPage());
		dispatch(resetDragItems());
		if (item) {
			dispatch(setDragItem(item));
			if (index) {
				dispatch(setDragIndex(index));
			}
		}
	};
};

export function resetDragPage () {
	return {
		type: RESET_DRAG_PAGE,
	};
}

export function resetDragItems () {
	return {
		type: RESET_DRAG_ITEMS,
	};
}

export function setDragItem (item) {
	return {
		type: SET_DRAG_ITEM,
		item,
	};
}

export function setDragIndex (index) {
	return {
		type: SET_DRAG_INDEX,
		index,
	};
}

export function setRowAlert (data) {
	return {
		type: SET_ROW_ALERT,
		data,
	};
}

export function moveItem (prevIndex, newIndex, options) {
	return {
		type: DRAG_MOVE_ITEM,
		prevIndex,
		newIndex,
		options,
	};
}

export function reorderItems (item, prevSortOrder, newSortOrder, goToPage) {
	// // reset drag
	// defaultDrag();
	return (dispatch, getState) => {
		if (goToPage) {
			// TODO FIGURE OUT IF THIS IS A RACE CONDITION
			dispatch(setCurrentPage(goToPage));
		}
		const state = getState();
		const list = state.lists.currentList;

		// Send the item, previous sortOrder and the new sortOrder
		// we should get the proper list and new page results in return
		list.reorderItems(
			item,
			prevSortOrder,
			newSortOrder,
			{
				search: state.active.search,
				filters: state.active.filters,
				sort: state.active.sort,
				columns: state.active.columns,
				page: state.lists.page,
			}, (err, items) => {
				// If err, flash the row alert
				if (err) {
					dispatch(resetItems(item.id));
					// return this.resetItems(this.findItemById[item.id]);
				} else {
					dispatch(itemsLoaded(items));
					dispatch(setRowAlert({
						success: item.id,
						fail: false,
					}));
				}
			}
		);
	};
}

export function resetItems (itemId) {
	return (dispatch, getState) => {
		const state = getState();
		const { page, drag } = state.lists;

		if (page.index !== drag.page) {
			// We are not on the original page so we need to move back to it
			dispatch(setCurrentPage(drag.page));
			dispatch(loadItems({
				fail: true,
				id: itemId,
			}));
			// reset drag
			// return defaultDrag();
		}

		// Reset the list if dragout or error
		dispatch(setRowAlert({
			success: false,
			fail: itemId,
		}));
		// we use the cached clone since this is the same page
		// the clone contains the proper index numbers which get overwritten on drag
		// _items.results = drag.clonedItems;
		// defaultDrag();
		// this.notifyChange();
	};
}
