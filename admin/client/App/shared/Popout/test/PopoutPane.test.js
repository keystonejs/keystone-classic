import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import PopoutPane from '../PopoutPane';

describe('<PopoutPane />', () => {
	it('should render a div', () => {
		const component = shallow(<PopoutPane />);
		demand(component.find('div').length).eql(1);
	});

	it('should have a class of Popout__pane', () => {
		const component = shallow(<PopoutPane />);
		demand(component.find('div').prop('className')).eql('Popout__pane');
	});

	it('should have a class of Popout__pane even when another class is passed', () => {
		const classname = 'something__else';
		const component = shallow(<PopoutPane className={classname} />);
		demand(component.find('div').prop('className')).include('Popout__pane');
		demand(component.find('div').prop('className')).include(classname);
	});

	it('should render its children', () => {
		const children = (<h1>Hello World!</h1>);
		const component = shallow(
			<PopoutPane>{children}</PopoutPane>
		);

		demand(component.contains(children)).true();
	});
});
