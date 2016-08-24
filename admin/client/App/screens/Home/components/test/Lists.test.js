import React from 'react';
import demand from 'must';
import { shallow } from 'enzyme';
import { Lists } from '../Lists';

import ListTile from '../ListTile';

describe('<Lists />', () => {
	it('should render the lists', () => {
		const lists = [{}, {}];
		const component = shallow(<Lists lists={lists} listsData={{}} counts={{}} />);
		demand(component.find(ListTile).length).eql(lists.length);
	});

	it('should not prefix the admin url for external lists', () => {
		const externalPath = 'http://someurl.com/some/path';
		const internalPath = 'some/path';
		const lists = [{
			external: true,
			path: externalPath,
		}, {
			path: internalPath,
		}];
		const component = shallow(<Lists lists={lists} listsData={{}} counts={{}} />);
		demand(component.find(ListTile).at(0).prop('href')).eql(externalPath);
	});

	it('should render counts', () => {
		const lists = [
			{
				key: 'somekey',
				path: 'some/path',
			},
		];
		const counts = {
			somekey: 50,
		};
		const component = shallow(<Lists lists={lists} listsData={{}} counts={counts} />);
		demand(component.find(ListTile).at(0).prop('count')).eql('50 Items');
	});

	it('should change the pluralization of the counts', () => {
		const lists = [
			{
				key: 'somekey',
				path: 'some/path',
			}, {
				key: 'someotherkey',
				path: 'some/other/path',
			},
		];
		const counts = {
			somekey: 1,
			someotherkey: 100,
		};
		const component = shallow(<Lists lists={lists} listsData={{}} counts={counts} />);
		demand(component.find(ListTile).at(0).prop('count')).eql('1 Item');
		demand(component.find(ListTile).at(1).prop('count')).eql('100 Items');
	});

	it('should hide the create button if it\'s a nocreate list', () => {
		const internalPath = 'some/path';
		const lists = [{
			path: internalPath,
		}];
		const listData = {
			[internalPath]: {
				nocreate: true,
			},
		};
		const component = shallow(<Lists lists={lists} listsData={listData} counts={{}} />);
		demand(component.find(ListTile).at(0).prop('hideCreateButton')).true();
	});

	describe('lists object', () => {
		it('should allow lists to be an object', () => {
			const lists = {
				somekey: {
					path: 'some/path',
				},
				someotherkey: {
					path: 'some/other/path',
				},
			};
			const component = shallow(<Lists lists={lists} listsData={{}} counts={{}} />);
			demand(component.find(ListTile).length).eql(Object.keys(lists).length);
		});

		it('should render counts', () => {
			const lists = {
				somekey: {
					path: 'some/path',
				},
			};
			const counts = {
				somekey: 50,
			};
			const component = shallow(<Lists lists={lists} listsData={{}} counts={counts} />);
			demand(component.find(ListTile).at(0).prop('count')).eql('50 Items');
		});

		it('should change the pluralization of the counts', () => {
			const lists = {
				somekey: {
					path: 'some/path',
				},
				someotherkey: {
					path: 'some/other/path',
				},
			};
			const counts = {
				somekey: 1,
				someotherkey: 100,
			};
			const component = shallow(<Lists lists={lists} listsData={{}} counts={counts} />);
			demand(component.find(ListTile).at(0).prop('count')).eql('1 Item');
			demand(component.find(ListTile).at(1).prop('count')).eql('100 Items');
		});
	});
});
