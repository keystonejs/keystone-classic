// import React from 'react';
// import { shallow } from 'enzyme';
// import demand from 'must';
// import Signin from '../Signin';
//
// describe('<Signin />', () => {
// 	before(() => {
// 		global.Keystone = {
// 			csrf_header_key: 'asdf',
// 			csrf_header_value: '1234asdf',
// 		};
// 	});
//
// 	it('should render a div', () => {
// 		const component = shallow(<Signin />);
// 		demand(component.find(<div />).length).gt(1);
// 	});
//
// 	it('should render a hidden heading for accessibility', () => {
// 		const component = shallow(<Signin />);
// 		demand(component.find('h1.u-hidden-visually').length).gt(0);
// 		demand(component.find('h1.u-hidden-visually').at(0).contains('Sign In')).true();
// 	});
//
// 	it('should render the brand', () => {
// 		const component = shallow(<Signin />);
// 		demand(component.find('Brand').length).gt(0);
// 	});
// });
