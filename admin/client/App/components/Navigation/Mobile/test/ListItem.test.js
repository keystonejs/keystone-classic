import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import MobileListItem from '../ListItem';
import { Link } from 'react-router';

describe('<MobileListItem />', () => {
	it('should render a react-router Link', () => {
		const component = shallow(<MobileListItem />);
		demand(component.find(Link).length).eql(1);
	});

	it('should render its children', () => {
		const children = (<h1>Hello World!</h1>);
		const component = shallow(
			<MobileListItem>{children}</MobileListItem>
		);

		demand(component.contains(children)).true();
	});

	it('should link to the href prop', () => {
		const href = 'someurl.com';
		const component = shallow(<MobileListItem href={href} />);

		demand(component.find(Link).length).eql(1);
		demand(component.find(Link).at(0).prop('to')).eql(href);
	});
});
