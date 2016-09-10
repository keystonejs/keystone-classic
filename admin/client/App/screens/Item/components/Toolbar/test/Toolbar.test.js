import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import Toolbar from '../';

describe('<Toolbar />', () => {
	it('should render a div', () => {
		const component = shallow(<Toolbar />);
		demand(component.find('div').length).eql(1);
	});

	it('should have a class of Toolbar', () => {
		const component = shallow(<Toolbar />);
		demand(component.find('div').prop('className')).eql('Toolbar');
	});

	it('should render its children', () => {
		const children = (<h1>Hello World!</h1>);
		const component = shallow(
			<Toolbar>{children}</Toolbar>
		);

		demand(component.contains(children)).true();
	});
});
