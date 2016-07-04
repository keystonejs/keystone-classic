import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import App from '../App';

import MobileNavigation from '../components/Navigation/Mobile';
import PrimaryNavigation from '../components/Navigation/Primary';
import SecondaryNavigation from '../components/Navigation/Secondary';
import Footer from '../components/Footer';

const LIST_PATH = 'some/path';
const LIST_KEY = 'somelist';
const LIST_SECTION = 'somesection';

describe('<App />', () => {
	before(() => {
		// Mock the API data we get back
		global.Keystone = {
			lists: {
				[LIST_KEY]: {
					path: LIST_PATH,
					key: LIST_KEY,
					uiElements: [{
						type: 'heading',
						content: 'Hello World!',
					}],
				},
			},
			nav: {
				by: {
					list: {
						[LIST_KEY]: LIST_SECTION,
					},
				},
				sections: {},
			},
		};
	});

	it('should render the PrimaryNavigation', () => {
		const component = shallow(<App params={{}} />);
		demand(component.find(PrimaryNavigation).length).eql(1);
	});

	it('should render the MobileNavigation', () => {
		const component = shallow(<App params={{}} />);
		demand(component.find(MobileNavigation).length).eql(1);
	});

	it('should render the SecondaryNavigation if we\'re on a list', () => {
		const component = shallow(
			<App
				params={{
					listId: LIST_PATH,
				}}
			/>
		);

		demand(component.find(SecondaryNavigation).length).eql(1);
	});

	it('should render its children', () => {
		const children = (<h1>Hello World!</h1>);
		const component = shallow(
			<App params={{}}>{children}</App>
		);

		demand(component.contains(children)).true();
	});

	it('should render the footer', () => {
		const component = shallow(<App params={{}} />);
		demand(component.find(Footer).length).eql(1);
	});
});
