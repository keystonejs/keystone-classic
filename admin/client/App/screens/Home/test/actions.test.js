import demand from 'must';
import {
	countsLoaded,
} from '../actions';
import {
	COUNTS_LOADING_SUCCESS,
} from '../constants';

describe('<Home /> actions', () => {
	describe('countsLoaded()', () => {
		it('should return a type of COUNTS_LOADING_SUCCESS', () => {
			demand(countsLoaded().type).eql(COUNTS_LOADING_SUCCESS);
		});

		it('should pass the counts on', () => {
			const counts = { 'some/path': 100 };
			demand(countsLoaded(counts).counts).eql(counts);
		});
	});
});
