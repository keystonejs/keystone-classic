import React from 'react';
import demand from 'must';
import { shallow } from 'enzyme';
import { HomeView } from '../index';

import AlertMessages from '../../../shared/AlertMessages';
import ListTile from '../components/ListTile';

describe.only('<Home />', () => {
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

	describe('grouped nav', () => {
		// Headings are only rendered for the grouped nav
		it('should render a grouped nav by default', () => {
			global.Keystone.nav.sections = [{
				lists: [],
			}];
			const component = shallow(<HomeView />);
			demand(component.find('.dashboard-group__heading').length).gt(0);
			delete Keystone.nav.sections;
		});

		it('should have a data-section-label for e2e testing', () => {
			const label = 'Some Section Label';
			global.Keystone.nav.sections = [{
				lists: [],
				label,
			}];
			const component = shallow(<HomeView />);
			demand(component.find('.dashboard-group').at(0).prop('data-section-label')).eql(label);
			delete Keystone.nav.sections;
		});

		it('should render the items of a section', () => {
			const lists = [{}, {}];
			global.Keystone.nav.sections = [{
				lists,
			}];
			const component = shallow(<HomeView counts={{}} />);
			demand(component.find(ListTile).length).eql(lists.length);
			delete Keystone.nav.sections;
		});

		it('should adjust for external lists', () => {
			const externalPath = 'http://someurl.com/some/path';
			const internalPath = 'some/path';
			const lists = [{
				external: true,
				path: externalPath,
			}, {
				path: internalPath,
			}];
			global.Keystone.nav.sections = [{
				lists,
			}];
			const component = shallow(<HomeView counts={{}} />);
			demand(component.find(ListTile).at(0).prop('href')).eql(externalPath);
			Keystone.nav.sections = [];
		});
	});

	describe('flat nav', () => {
		it('should render a flat nav if specified', () => {
			global.Keystone.nav.flat = true;
			const component = shallow(<HomeView />);
			demand(component.find('.dashboard-group__heading').length).eql(0);
			delete global.Keystone.nav.flat;
		});

		it('should render a ListTile for each list', () => {
			global.Keystone.nav.flat = true;
			const lists = {
				somekey: {},
				someotherkey: {},
			};
			global.Keystone.lists = lists;
			const component = shallow(<HomeView counts={{}} />);
			demand(component.find(ListTile).length).eql(Object.keys(lists).length);
			delete global.Keystone.lists;
			delete global.Keystone.nav.flat;
		});

		it('should adjust for external lists', () => {
			global.Keystone.nav.flat = true;
			const externalPath = 'http://someurl.com/some/path';
			const internalPath = 'some/path';
			const lists = [{
				external: true,
				path: externalPath,
			}, {
				path: internalPath,
			}];
			global.Keystone.lists = lists;
			const component = shallow(<HomeView counts={{}} />);
			demand(component.find(ListTile).at(0).prop('href')).eql(externalPath);
			delete global.Keystone.lists;
			delete global.Keystone.nav.flat;
		});
	});

	describe('orphaned lists', () => {
		it('should render ListTiles for orphaned lists', () => {
			const orphanedLists = [{}, {}, {}];
			global.Keystone.orphanedLists = orphanedLists;
			const component = shallow(<HomeView counts={{}} />);
			demand(component.find(ListTile).length).eql(orphanedLists.length);
			delete global.Keystone.orphanedLists;
		});

		it('should render a section label of "Other"', () => {
			const orphanedLists = [{}, {}, {}];
			global.Keystone.orphanedLists = orphanedLists;
			const component = shallow(<HomeView counts={{}} />);
			demand(component.contains('Other')).true();
			delete global.Keystone.orphanedLists;
		});

		it('should adjust for external lists', () => {
			const externalPath = 'http://someurl.com/some/path';
			const internalPath = 'some/path';
			const orphanedLists = [{
				external: true,
				path: externalPath,
			}, {
				path: internalPath,
			}];
			global.Keystone.orphanedLists = orphanedLists;
			const component = shallow(<HomeView counts={{}} />);
			demand(component.find(ListTile).at(0).prop('href')).eql(externalPath);
			delete global.Keystone.orphanedLists;
		});
	});
});
