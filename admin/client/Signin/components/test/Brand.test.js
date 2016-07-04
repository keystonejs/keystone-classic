import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import Brand from '../Brand';

describe('<Brand />', () => {
	beforeEach(() => {
		global.Keystone = {
			adminPath: '',
		};
	});

	it('should render the KeystoneJS logo by default', () => {
		const component = shallow(<Brand />);
		demand(component.find('img').prop('src')).eql('/images/logo.png');
		demand(component.find('img').prop('width')).eql(205);
		demand(component.find('img').prop('height')).eql(68);
	});

	it('should render a link to the root page', () => {
		const component = shallow(<Brand />);
		demand(component.find('a[href="/"]').length).eql(1);
	});

	it('should handle that the admin path is changed for the default logo', () => {
		global.Keystone.adminPath = '/admin';
		const component = shallow(<Brand />);
		demand(component.find('img').prop('src')).eql('/admin/images/logo.png');
		demand(component.find('img').prop('width')).eql(205);
		demand(component.find('img').prop('height')).eql(68);
	});

	it('should handle a different path to a logo', () => {
		const logoUrl = 'someimage.jpg';
		const component = shallow(<Brand logo={logoUrl} />);
		demand(component.find('img').prop('src')).eql(logoUrl);
	});

	it('should handle changing the src of the logo when passed an object', () => {
		const logo = {
			src: 'someimage.jpg',
		};
		const component = shallow(<Brand logo={logo} />);
		demand(component.find('img').prop('src')).eql(logo.src);
	});

	it('should handle changing the width of the logo', () => {
		const logo = {
			width: 100,
		};
		const component = shallow(<Brand logo={logo} />);
		demand(component.find('img').prop('width')).eql(logo.width);
	});

	it('should handle changing the height of the logo', () => {
		const logo = {
			height: 100,
		};
		const component = shallow(<Brand logo={logo} />);
		demand(component.find('img').prop('height')).eql(logo.height);
	});

	it('should handle all three properties changing at once', () => {
		const logo = {
			src: 'someimage.jpg',
			width: 100,
			height: 100,
		};
		const component = shallow(<Brand logo={logo} />);
		demand(component.find('img').prop('src')).eql(logo.src);
		demand(component.find('img').prop('height')).eql(logo.height);
		demand(component.find('img').prop('width')).eql(logo.width);
	});

	it('should handle changing the src of the logo when passed an array', () => {
		const src = 'someimage.jpg';
		const logo = [src];
		const component = shallow(<Brand logo={logo} />);
		demand(component.find('img').prop('src')).eql(src);
	});

	it('should handle changing the width of the logo when passed an array', () => {
		const width = 50;
		const logo = [null, width];
		const component = shallow(<Brand logo={logo} />);
		demand(component.find('img').prop('width')).eql(width);
	});

	it('should handle changing the height of the logo when passed an array', () => {
		const height = 50;
		const logo = [undefined, undefined, height];
		const component = shallow(<Brand logo={logo} />);
		demand(component.find('img').prop('height')).eql(height);
	});

	it('should handle changing all three as an array', () => {
		const src = 'someimage.jpg';
		const width = 50;
		const height = 50;
		const logo = [src, width, height];
		const component = shallow(<Brand logo={logo} />);
		demand(component.find('img').prop('src')).eql(src);
		demand(component.find('img').prop('height')).eql(height);
		demand(component.find('img').prop('width')).eql(width);
	});
});
