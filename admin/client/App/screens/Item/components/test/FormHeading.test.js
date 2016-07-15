import React from 'react';
import demand from 'must';
import FormHeading from '../FormHeading';
import { shallow } from 'enzyme';

// Does not test evalDependsOn since that's already tested
describe('<FormHeading />', () => {
	it('should render an h3', () => {
		const component = shallow(
			<FormHeading options={{}} />
		);
		demand(component.find('h3').length).eql(1);
	});

	it('should render its content', () => {
		const content = 'Hello World!';
		const component = shallow(
			<FormHeading options={{}} content={content} />
		);
		demand(component.contains(content)).true();
	});
});
