import demand from 'must';
import getRelatedIconClass from '../getRelatedIconClass';

describe('getRelatedIconClass', () => {
	it('should return "octicon-primitive-dot" by default', () => {
		demand(getRelatedIconClass('')).eql('octicon octicon-primitive-dot');
	});

	it('should return a related icon class', () => {
		demand(getRelatedIconClass('times')).eql('octicon octicon-clock');
	});
});
