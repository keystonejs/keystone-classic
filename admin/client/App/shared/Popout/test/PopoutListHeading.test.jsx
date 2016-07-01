import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import PopoutListHeading from '../PopoutListHeading';

describe('<PopoutListHeading />', () => {
	it('should render a div', () => {
		const component = shallow(<PopoutListHeading />);
		demand(component.find('div').length).eql(1);
	});

	it('should have a class of PopoutList__heading', () => {
		const component = shallow(<PopoutListHeading />);
		demand(component.find('div').prop('className')).eql('PopoutList__heading');
	});

	it('should render its children', () => {
		const children = (<h1>Hello World!</h1>);
		const component = shallow(
			<PopoutListHeading>{children}</PopoutListHeading>
		);

		demand(component.contains(children)).true();
	});
});
