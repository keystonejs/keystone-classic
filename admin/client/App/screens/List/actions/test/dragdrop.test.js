import demand from 'must';
import {
	resetDragPage,
	resetDragItems,
	setDragItem,
	setDragIndex,
	setRowAlert,
	moveItem,
} from '../dragdrop';
import {
	RESET_DRAG_PAGE,
	RESET_DRAG_ITEMS,
	SET_DRAG_ITEM,
	SET_DRAG_INDEX,
	SET_ROW_ALERT,
	DRAG_MOVE_ITEM,
} from '../../constants';


describe('<List /> dragdrop actions', () => {
	describe('resetDragPage()', () => {
		it('should have a type of RESET_DRAG_PAGE', () => {
			demand(resetDragPage().type).eql(RESET_DRAG_PAGE);
		});
	});

	describe('resetDragItems()', () => {
		it('should have a type of RESET_DRAG_ITEMS', () => {
			demand(resetDragItems().type).eql(RESET_DRAG_ITEMS);
		});
	});

	describe('setDragItem()', () => {
		it('should have a type of SET_DRAG_ITEM', () => {
			demand(setDragItem().type).eql(SET_DRAG_ITEM);
		});

		it('should pass on the item', () => {
			const item = { some: 'item' };
			demand(setDragItem(item).item).eql(item);
		});
	});

	describe('setDragIndex()', () => {
		it('should have a type of SET_DRAG_INDEX', () => {
			demand(setDragIndex().type).eql(SET_DRAG_INDEX);
		});

		it('should pass on the index', () => {
			const index = 100;
			demand(setDragIndex(index).index).eql(index);
		});
	});

	describe('setRowAlert()', () => {
		it('should have a type of SET_ROW_ALERT', () => {
			demand(setRowAlert().type).eql(SET_ROW_ALERT);
		});

		it('should pass on the data', () => {
			const data = 100;
			demand(setRowAlert(data).data).eql(data);
		});
	});

	describe('moveItem()', () => {
		it('should have a type of DRAG_MOVE_ITEM', () => {
			demand(moveItem().type).eql(DRAG_MOVE_ITEM);
		});

		it('should pass on the previous index', () => {
			const prevIndex = 100;
			demand(moveItem(prevIndex).prevIndex).eql(prevIndex);
		});

		it('should pass on the new index', () => {
			const newIndex = 100;
			demand(moveItem(undefined, newIndex).newIndex).eql(newIndex);
		});

		it('should pass on the options', () => {
			const options = { some: 'options' };
			demand(moveItem(undefined, undefined, options).options).eql(options);
		});
	});
});
