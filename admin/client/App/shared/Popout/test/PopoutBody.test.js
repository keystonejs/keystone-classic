import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import PopoutBody from '../PopoutBody';

describe('<PopoutBody />', () => {
	it('should render a div', () => {
		const component = shallow(<PopoutBody />);
		demand(component.find('div').length).eql(1);
	});

	it('should have a class of Popout__body', () => {
		const component = shallow(<PopoutBody />);
		demand(component.find('div').at(0).prop('className')).eql('Popout__body');
	});

	it('should add a class name when scrollable', () => {
		const component = shallow(<PopoutBody scrollable />);
		demand(component.find('div').at(0).prop('className'))
			.eql('Popout__body Popout__scrollable-area');
	});

	it('should have a class of PopoutBody even when another class is passed', () => {
		const classname = 'something__else';
		const component = shallow(<PopoutBody className={classname} />);
		demand(component.find('div').prop('className')).include('Popout__body');
		demand(component.find('div').prop('className')).include(classname);
	});

	it('should render its children', () => {
		const children = (<h1>Hello World!</h1>);
		const component = shallow(
			<PopoutBody>{children}</PopoutBody>
		);

		demand(component.contains(children)).true();
	});
});
