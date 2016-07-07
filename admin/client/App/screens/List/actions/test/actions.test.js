import demand from 'must';
import {
	setCurrentPage,
} from '../';
import {
	SET_CURRENT_PAGE,
} from '../../constants';

describe('<List /> actions', () => {
	describe('setCurrentPage', () => {
		it('should have a type of SET_CURRENT_PAGE', () => {
			demand(setCurrentPage().type).eql(SET_CURRENT_PAGE);
		});

		it('should pass on the page index', () => {
			const index = 25;
			demand(setCurrentPage(index).index).eql(index);
		});
	});
});
