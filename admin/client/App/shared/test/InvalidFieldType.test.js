import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import InvalidFieldType from '../InvalidFieldType';

describe('<InvalidFieldType />', () => {
	it('should render a message saying that a field type is invalid', () => {
		const type = 'txt';
		const path = 'some/path';
		const component = shallow(<InvalidFieldType type={type} path={path} />);

		demand(component.text()).eql(`Invalid field type ${type} at path ${path}`);
	});
});
