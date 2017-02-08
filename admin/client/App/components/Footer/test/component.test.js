import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import Footer from '../';

describe('<Footer />', () => {
	it('should render a <footer> tag', () => {
		const component = shallow(<Footer />);
		demand(component.find('footer').type()).eql('footer');
		demand(component.find('footer').length).eql(1);
	});

	it('should have a data prop of "keystone-footer"', () => {
		const component = shallow(<Footer />);
		demand(component.prop('data-keystone-footer')).eql(true);
	});

	// TODO FIX THIS, possibly a test problem
	it.skip('should render a link to KeystoneJS', () => {
		const component = shallow(
			<Footer />
		);
		demand(component.find('a[href="http://keystonejs.com"]').length).eql(1);
	});

	describe('this.props', () => {
		it('should render a link to the backUrl', () => {
			const backUrl = '/home';
			const component = shallow(
				<Footer
					backUrl={backUrl}
				/>
			);
			demand(component.find(`a[href="${backUrl}"]`).length).eql(1);
		});

		it('should render the brand', () => {
			const brand = 'My Company';
			const component = shallow(
				<Footer
					brand={brand}
				/>
			);
			demand(component.contains(brand)).true();
		});

		// TODO FIX THIS, possibly test problem
		it.skip('should render the appversion', () => {
			const appversion = '2.0';
			const component = shallow(
				<Footer
					appversion={appversion}
				/>
			);
			demand(component.contains(appversion)).true();
		});

		it('should render the KeystoneJS version', () => {
			const version = '1.0';
			const component = shallow(
				<Footer
					version={version}
				/>
			);
			demand(component.contains(version)).true();
		});

		// TODO FIX THIS
		it.skip('should render the current user', () => {
			const User = {
				path: '/users',
				getDocumentName: () => {
					return 'Max Stoiber';
				},
			};
			const user = {
				id: 'max',
			};
			const component = shallow(
				<Footer
					User={User}
					user={user}
				/>
			);
			demand(component.contains(User.getDocumentName(user))).true();
		});
	});
});
