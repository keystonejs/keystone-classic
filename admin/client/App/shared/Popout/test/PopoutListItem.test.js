import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import PopoutListItem from '../PopoutListItem';

describe('<PopoutListItem />', () => {
	it('should render a button and a span', () => {
		const component = shallow(<PopoutListItem />);
		demand(component.find('button').length).eql(1);
		demand(component.find('span').length).eql(1);
	});

	it('should have a classname of PopoutList__item', () => {
		const component = shallow(<PopoutListItem />);
		demand(component.find('button').prop('className')).eql('PopoutList__item');
	});

	it('should have a selected classname', () => {
		const component = shallow(<PopoutListItem isSelected />);
		demand(component.find('button').prop('className')).eql('PopoutList__item is-selected');
	});

	it('should render an icon', () => {
		const component = shallow(<PopoutListItem icon="globe" />);
		demand(component.find('span').length).eql(2);
		demand(component.find('span').at(0).prop('className').indexOf('octicon-globe') > -1).true();
	});

	it('should render a label', () => {
		const label = 'Some label';
		const component = shallow(<PopoutListItem label={label} />);

		demand(component.contains(label)).true();
	});
});
