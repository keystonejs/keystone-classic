/* eslint-disable */

import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import UserInfo from '../UserInfo';

const props = {
	adminPath: '/admin',
	signoutPath: '/admin/signout',
	user: {
		name: 'Max',
	},
};

describe('<UserInfo />', () => {

	// TODO @mxstbr
	// These are failing, partly because Aphrodite doesn't play nicely with enzyme !?

	it.skip('should render a message with the name of the user', () => {
		const component = shallow(<UserInfo {...props} />);
		demand(component.contains(props.user.name)).true();
		demand(component.contains('You\'re already signed in.')).true();
	});

	it.skip('should render an "Sign Out" button', () => {
		const component = shallow(<UserInfo {...props} />);
		demand(component.find('Button').length).eql(1);
		demand(component.find('Button').at(0).prop('href')).eql(props.signoutPath);
		demand(component.find('Button').at(0).html()).include('Sign Out');
	});

	it.skip('should render an "Open Keystone" button if the user can access it', () => {
		const component = shallow(<UserInfo {...props} userCanAccessKeystone />);
		demand(component.find('Button').length).eql(2);
		demand(component.find('Button').at(0).prop('href')).eql(props.adminPath);
		demand(component.find('Button').at(0).html()).include('Open Keystone');
	});
});
