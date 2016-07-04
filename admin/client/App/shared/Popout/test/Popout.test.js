import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import Popout from '../';
import Portal from '../../Portal';

describe('<Popout />', () => {
	it('should render a Portal', () => {
		const component = shallow(<Popout />);
		demand(component.find(Portal).length).eql(1);
	});

	describe('open', () => {
		it('should render a blockout', () => {
			const component = shallow(<Popout isOpen />);
			demand(component.find('div.blockout').length).eql(1);
		});

		it('should render a popout', () => {
			const component = shallow(<Popout isOpen />);
			demand(component.find('div.Popout').length).eql(1);
		});

		it('should render its children', () => {
			const children = (<h1>Hello World!</h1>);
			const component = shallow(
				<Popout isOpen>{children}</Popout>
			);

			demand(component.contains(children)).true();
		});
	});
});
