import React from 'react';
import demand from 'must';
import { shallow } from 'enzyme';
import { HomeView } from '../index';

import AlertMessages from '../../../shared/AlertMessages';
import Section from '../components/Section';
import Lists from '../components/Lists';

describe('<Home />', () => {
	before(() => {
		global.Keystone = {
			nav: {
				sections: [],
			},
			orphanedLists: [],
			lists: [],
		};
	});

	it('should have a data-screen-id for e2e testing', () => {
		const component = shallow(<HomeView />);
		demand(component.prop('data-screen-id')).eql('home');
	});

	it('should render the brand', () => {
		const brand = 'Some Brand';
		global.Keystone.brand = brand;
		const component = shallow(<HomeView />);
		demand(component.contains(brand)).true();
		delete global.Keystone.brand;
	});

	it('should render a generic error message', () => {
		const component = shallow(
			<HomeView error="Some error" />
		);
		demand(component.find(AlertMessages).length).eql(1);
		demand(component.find(AlertMessages).at(0).prop('alerts')).eql({ error: { error:
			"There is a problem with the network, we're trying to reconnect...",
		} });
	});

	// Sections are only rendered for the grouped nav
	it('should render a grouped nav by default', () => {
		global.Keystone.nav.sections = [{
			lists: [],
		}];
		const component = shallow(<HomeView />);
		demand(component.find(Section).length).gt(0);
		Keystone.nav.sections = [];
	});

	it('should render a flat nav if specified', () => {
		global.Keystone.nav.flat = true;
		const component = shallow(<HomeView />);
		demand(component.find(Section).length).eql(0);
		delete global.Keystone.nav.flat;
	});

	describe('orphaned lists', () => {
		it('should render orphaned lists', () => {
			const orphanedLists = [{}, {}, {}];
			global.Keystone.orphanedLists = orphanedLists;
			const component = shallow(<HomeView counts={{}} />);
			demand(component.find(Lists).length).eql(1);
			demand(component.find(Lists).at(0).prop('lists')).eql(orphanedLists);
			delete global.Keystone.orphanedLists;
		});

		it('should render a section label of "Other"', () => {
			const orphanedLists = [{}, {}, {}];
			global.Keystone.orphanedLists = orphanedLists;
			const component = shallow(<HomeView counts={{}} />);
			demand(component.find(Section).at(0).prop('label')).eql('Other');
			delete global.Keystone.orphanedLists;
		});
	});
});
