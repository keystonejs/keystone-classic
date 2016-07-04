import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import PopoutHeader from '../PopoutHeader';

describe('<PopoutHeader />', () => {
	it('should render a div', () => {
		const component = shallow(<PopoutHeader />);
		demand(component.find('div').length).eql(1);
	});

	it('should render a button on the left', () => {
		const component = shallow(
			<PopoutHeader
				leftIcon="globe"
				leftAction={function () {}}
			/>
		);
		demand(component.find('button').length).eql(1);
	});

	it('should render a title', () => {
		const title = 'Some title';
		const component = shallow(
			<PopoutHeader
				title={title}
			/>
		);

		demand(component.find('span').length).eql(1);
		demand(component.find('span').contains(title)).true();
	});
});
