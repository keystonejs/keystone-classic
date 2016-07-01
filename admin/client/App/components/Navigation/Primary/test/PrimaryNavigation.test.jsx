import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import PrimaryNavigation from '../';
import PrimaryNavItem from '../NavItem';

describe.skip('<PrimaryNavigation />', () => {
	before(() => {
		global.window = {
			innerWidth: 769,
		};
	});

	it('should render a <nav>', () => {
		const component = shallow(<PrimaryNavigation />);
		demand(component.find('nav').length).eql(1);
	});

	it('should render a <ul>', () => {
		const component = shallow(<PrimaryNavigation />);
		demand(component.find('ul').length).eql(1);
	});

	it('should render the brand and a home button', () => {
		const brand = 'Stoiber Weinhandel & Webdesign e.U.';
		const component = shallow(
			<PrimaryNavigation brand={brand} />
		);

		demand(component.find(PrimaryNavItem).length).gt(0);
		demand(component.find(PrimaryNavItem).at(0).prop('title')).include(brand);
		demand(component.find(PrimaryNavItem).at(0).contain('span.octicon-home')).true();
	});
});
