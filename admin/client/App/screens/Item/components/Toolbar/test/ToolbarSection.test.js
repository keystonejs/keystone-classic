import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import ToolbarSection from '../ToolbarSection';

describe('<ToolbarSection />', () => {
	it('should render a div', () => {
		const component = shallow(<ToolbarSection />);
		demand(component.find('div').length).eql(1);
	});

	it('should have a class of Toolbar__section', () => {
		const component = shallow(<ToolbarSection />);
		demand(component.find('div').prop('className')).eql('Toolbar__section');
	});

	it('should have a class of Toolbar__section--left if left is true', () => {
		const component = shallow(<ToolbarSection left />);
		demand(component.find('div').prop('className')).include('Toolbar__section--left');
	});

	it('should have a class of Toolbar__section--right if right is true', () => {
		const component = shallow(<ToolbarSection right />);
		demand(component.find('div').prop('className')).include('Toolbar__section--right');
	});

	it('should render its children', () => {
		const children = (<h1>Hello World!</h1>);
		const component = shallow(
			<ToolbarSection>{children}</ToolbarSection>
		);

		demand(component.contains(children)).true();
	});
});
