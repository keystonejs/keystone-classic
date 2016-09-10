import demand from 'must';
import {
	selectItem,
	dataLoaded,
	dataLoadingError,
} from '../actions';
import {
	SELECT_ITEM,
	DATA_LOADING_SUCCESS,
	DATA_LOADING_ERROR,
} from '../constants';


describe('<Item /> actions', () => {
	describe('selectItem()', () => {
		it('should have a type of SELECT_ITEM', () => {
			demand(selectItem().type).eql(SELECT_ITEM);
		});

		it('should pass on the itemId', () => {
			const itemId = 504;
			demand(selectItem(itemId).id).eql(itemId);
		});
	});

	describe('dataLoaded()', () => {
		it('should have a type of DATA_LOADING_SUCCESS', () => {
			demand(dataLoaded().type).eql(DATA_LOADING_SUCCESS);
		});

		it('should pass on the data', () => {
			const data = { some: 'field' };
			demand(dataLoaded(data).data).eql(data);
		});
	});

	describe('dataLoadingError()', () => {
		it('should have a type of DATA_LOADING_ERROR', () => {
			demand(dataLoadingError().type).eql(DATA_LOADING_ERROR);
		});

		it('should pass on the error', () => {
			const error = { some: 'error' };
			demand(dataLoadingError(error).error).eql(error);
		});
	});
});
