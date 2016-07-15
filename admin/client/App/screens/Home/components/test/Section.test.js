import React from 'react';
import demand from 'must';
import { shallow } from 'enzyme';
import Section from '../Section';

describe('<Section />', () => {
	it('should render its label', () => {
		const label = 'Some Section Label';
		const component = shallow(<Section label={label} />);
		demand(component.contains(label)).true();
	});

	it('should have a data-section-label for e2e testing', () => {
		const label = 'Some Section Label';
		const component = shallow(<Section label={label} />);
		demand(component.find('.dashboard-group').at(0).prop('data-section-label')).eql(label);
	});

	it('should allow an icon classname to be passed in', () => {
		const iconClassname = 'octicon-someicon';
		const component = shallow(<Section icon={iconClassname} />);
		demand(component.find(`.${iconClassname}`).length).eql(1);
	});

	it('should render its children', () => {
		const children = (<h1>Hello World!</h1>);
		const component = shallow(
			<Section>{children}</Section>
		);
		demand(component.contains(children)).true();
	});
});
