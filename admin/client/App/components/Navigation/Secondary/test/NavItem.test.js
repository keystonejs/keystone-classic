import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import SecondaryNavItem from '../NavItem';
import { Link } from 'react-router';

describe('<SecondaryNavItem />', () => {
	it('should render a list item', () => {
		const component = shallow(<SecondaryNavItem />);
		demand(component.find('li').length).eql(1);
	});

	it('should render a data-list-path for the e2e tests', () => {
		const path = 'some path';
		const component = shallow(<SecondaryNavItem path={path} />);
		demand(component.find('li').at(0).prop('data-list-path')).eql(path);
	});

	it('should render a react-router Link', () => {
		const component = shallow(<SecondaryNavItem href="/something" />);
		demand(component.find(Link).length).eql(1);
	});

	it('should render its children inside the Link', () => {
		const children = (<h1>Hello World!</h1>);
		const component = shallow(
			<SecondaryNavItem href="something">{children}</SecondaryNavItem>
		);
		demand(component.find(Link).at(0).contains(children)).true(1);
	});
});
