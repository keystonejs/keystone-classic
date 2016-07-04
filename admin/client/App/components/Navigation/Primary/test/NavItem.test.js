import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import PrimaryNavItem from '../NavItem';
import { Link } from 'react-router';

describe('<PrimaryNavItem />', () => {
	it('should render a list item', () => {
		const component = shallow(<PrimaryNavItem />);
		demand(component.find('li').length).eql(1);
	});

	it('should render a data-section-label for the e2e tests', () => {
		const label = 'some label';
		const component = shallow(<PrimaryNavItem label={label} />);
		demand(component.find('li').at(0).prop('data-section-label')).eql(label);
	});

	it('should render an anchor tab by default', () => {
		const component = shallow(<PrimaryNavItem />);
		demand(component.find('a').length).eql(1);
	});

	it('should render its children inside the anchor', () => {
		const children = (<h1>Hello World!</h1>);
		const component = shallow(
			<PrimaryNavItem>{children}</PrimaryNavItem>
		);
		demand(component.find('a').at(0).contains(children)).true(1);
	});

	it('should render a react-router link if the to prop is specified', () => {
		const component = shallow(<PrimaryNavItem to="/something" />);
		demand(component.find(Link).length).eql(1);
	});

	it('should render its children inside the Link', () => {
		const children = (<h1>Hello World!</h1>);
		const component = shallow(
			<PrimaryNavItem to="something">{children}</PrimaryNavItem>
		);
		demand(component.find(Link).at(0).contains(children)).true(1);
	});
});
