import demand from 'must';
import {
	itemsLoaded,
} from '../items';
import {
	ITEMS_LOADED,
} from '../../constants';

describe('<List> items actions', () => {
	describe('itemsLoaded()', () => {
		it('should have a type of ITEMS_LOADED', () => {
			demand(itemsLoaded().type).eql(ITEMS_LOADED);
		});

		it('should pass on the items', () => {
			const items = [{ some: 'item' }];
			demand(itemsLoaded(items).items).eql(items);
		});
	});
});
