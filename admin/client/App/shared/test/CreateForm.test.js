// import React from 'react';
// import { shallow } from 'enzyme';
// import demand from 'must';
// import CreateForm from '../CreateForm';
// import { Modal, Form } from 'elemental';
//
// describe('<CreateForm />', () => {
// 	beforeEach(() => {
// 		global.Keystone = {
// 			csrf: {
// 				key: 'something',
// 				value: 'else',
// 			},
// 		};
// 	});
//
// 	it('should render a Modal', () => {
// 		const component = shallow(<CreateForm />);
// 		demand(component.find(Modal).length).equal(1);
// 	});
//
// 	it('should render a Form if it\'s open', () => {
// 		const component = shallow(<CreateForm />);
// 		demand(component.find(Form).length).equal(1);
// 	});
// });
