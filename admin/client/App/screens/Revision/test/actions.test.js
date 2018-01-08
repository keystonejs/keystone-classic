import demand from 'must';
import {
	dataLoaded,
	dataLoadingError,
} from '../actions';
import {
	DATA_LOADING_SUCCESS,
	DATA_LOADING_ERROR,
} from '../constants';

describe('<Revision /> actions', () => {
	describe('dataLoaded', () => {
		it('should have a type of DATA_LOADING_SUCCESS', () => {
			demand(dataLoaded().type).eql(DATA_LOADING_SUCCESS);
		});

		it('should pass on the data', () => {
			demand(dataLoaded({ some: 'data' }).payload).eql({ some: 'data' });
		});
	});

	describe('dataLoadingError', () => {
		it('should have a type of DATA_LOADING_ERROR', () => {
			demand(dataLoadingError().type).eql(DATA_LOADING_ERROR);
		});

		it('should pass on the id', () => {
			demand(dataLoadingError('foobar').payload).eql('foobar');
		});
	});
});
