import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import Signin from '../Signin';

describe('<Signin />', () => {
	before(() => {
		global.window = {
			location: {},
		};
	});

	it('should render a div', () => {
		const component = shallow(<Signin />);
		demand(component.find('div').length).gt(0);
	});

	it('should render the brand', () => {
		const component = shallow(<Signin />);
		demand(component.find('Brand').length).gt(0);
	});
});
