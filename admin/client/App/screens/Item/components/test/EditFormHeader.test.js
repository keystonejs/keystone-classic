import React from 'react';
import demand from 'must';
import { EditFormHeader } from '../EditFormHeader';
import { shallow } from 'enzyme';

import Toolbar from '../Toolbar';
import ToolbarSection from '../Toolbar/ToolbarSection';
import { Button, FormInput, ResponsiveText } from '../../../../elemental';
import { Link } from 'react-router';

describe('<EditFormHeader />', () => {
	before(() => {
		global.Keystone = {
			adminPath: '',
			csrf: {},
		};
	});

	it('should render a Toolbar', () => {
		const component = shallow(<EditFormHeader data={{}} list={{}} />);
		demand(component.find(Toolbar).length).gt(0);
	});

	describe('Drilldown', () => {
		it('should render a Toolbar Section on the left', () => {
			const component = shallow(<EditFormHeader data={{}} list={{}} />);
			demand(component.find(ToolbarSection).length).gt(0);
			demand(component.find(ToolbarSection).at(0).prop('left')).true();
		});

		// TODO @mxstbr - It really seems like this should be passing ??
		it.skip('should render a link back to the list if no items are specified', () => {
			const path = 'some/path';
			const component = shallow(
				<EditFormHeader
					data={{}}
					list={{
						path,
					}}
				/>
			);
			demand(component.find('.e2e-editform-header-back').length).eql(1);
			demand(component.find('.e2e-editform-header-back').at(0).prop('to')).eql('/' + path);
		});

		it.skip('should render items passed in', () => {
			const items = [{
				href: 'some/item',
			}, {
				href: 'some/other/item',
			}];
			const component = shallow(
				<EditFormHeader
					data={{
						drilldown: {
							items: [{
								list: {},
								items,
							}],
						},
					}}
					list={{}}
				/>
			);
			const BACKBUTTON = 1;
			demand(component.find(Link).length).eql(BACKBUTTON + items.length);
		});

		it.skip('should render one less separator then there\'s items', () => {
			const items = [{
				href: 'some/item',
			}, {
				href: 'some/other/item',
			}];
			const component = shallow(
				<EditFormHeader
					data={{
						drilldown: {
							items: [{
								list: {},
								items,
							}],
						},
					}}
					list={{}}
				/>
			);
			demand(component.find('.separator').length).eql(items.length - 1);
		});

		it.skip('should render ... if there\'s more items', () => {
			const component = shallow(
				<EditFormHeader
					data={{
						drilldown: {
							items: [{
								list: {},
								more: true,
								items: [],
							}],
						},
					}}
					list={{}}
				/>
			);
			demand(component.contains('...')).true();
		});

		it.skip('should render a back button if there\'s items', () => {
			const component = shallow(
				<EditFormHeader
					data={{
						drilldown: {
							items: [{
								list: {},
								more: true,
								items: [],
							}],
						},
					}}
					list={{}}
				/>
			);
			demand(component.find('.e2e-editform-header-back').length).eql(1);
		});

		it('should render a search form', () => {
			const component = shallow(<EditFormHeader data={{}} list={{}} />);
			demand(component.find('form.EditForm__header__search').length).eql(1);
		});

		// TODO needs to be reconfigured
		it.skip('should render a search input', () => {
			const component = shallow(<EditFormHeader data={{}} list={{}} />);
			demand(component.find(FormInput).length).eql(1);
			demand(component.find(FormInput).at(0).prop('type')).eql('search');
		});
	});

	describe('Info', () => {
		it('should render a Toolbar Section on the right', () => {
			const component = shallow(<EditFormHeader data={{}} list={{}} />);
			demand(component.find(ToolbarSection).length).gt(0);
			demand(component.find(ToolbarSection).at(1).prop('right')).true();
		});

		it.skip('should render a create button', () => {
			const component = shallow(<EditFormHeader data={{}} list={{}} />);
			demand(component.find(Button).find(ResponsiveText).at(0).prop('visibleXS')).eql('Create');
		});

		it('should not render a create button if the list is a nocreate', () => {
			const component = shallow(
				<EditFormHeader
					data={{}}
					list={{
						nocreate: true,
					}}
				/>
			);
			demand(component.find(Button).length).eql(0);
		});

		it.skip('should change the href if the list is an autocreate', () => {
			const component = shallow(
				<EditFormHeader
					data={{}}
					list={{
						autocreate: true,
					}}
				/>
			);
			demand(component.find(Button).prop('href')).include('?new');
		});
	});
});
