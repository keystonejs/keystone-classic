import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import UserInfo from '../UserInfo';

const user = {
	name: {
		first: 'Max',
	},
};

describe('<UserInfo />', () => {
	beforeEach(() => {
		global.Keystone = {
			adminPath: '/admin',
		};
	});

	it('should render a span if no user is logged in', () => {
		const component = shallow(<UserInfo />);
		demand(component.equals(<span />)).true();
	});

	it('should render a message with the first name of the user', () => {
		const component = shallow(<UserInfo user={user} />);
		demand(component.contains(user.name.first)).true();
		demand(component.contains('You\'re already signed in.')).true();
	});

	it('should render an "Sign Out" button', () => {
		const component = shallow(<UserInfo user={user} />);
		demand(component.find('Button').length).eql(1);
		demand(component.find('Button').at(0).prop('href')).eql('/admin/signout');
		demand(component.find('Button').at(0).html()).include('Sign Out');
	});

	it('should render an "Open Keystone" button if the user can access it', () => {
		const component = shallow(<UserInfo user={user} userCanAccessKeystone />);
		demand(component.find('Button').length).eql(2);
		demand(component.find('Button').at(0).prop('href')).eql('/admin');
		demand(component.find('Button').at(0).html()).include('Open Keystone');
	});

	it('should handle the adminPath option', () => {
		global.Keystone = {
			adminPath: '/custom',
		};
		const component = shallow(<UserInfo user={user} userCanAccessKeystone />);
		demand(component.find('Button').length).eql(2);
		demand(component.find('Button').at(0).prop('href')).eql('/custom');
	});
});
