import React from 'react';
import demand from 'must';
import AltText from '../AltText';
import { shallow } from 'enzyme';

describe('<AltText />', () => {
	it('should render a span by default', () => {
		const component = shallow(<AltText />);
		demand(component.find('span').length).gt(0);
	});

	it('should render a different component if passed in', () => {
		const passed = 'div';
		const component = shallow(<AltText component={passed} />);
		demand(component.find(passed).length).gt(0);
	});
});
