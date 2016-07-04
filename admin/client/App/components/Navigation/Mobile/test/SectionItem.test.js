import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import MobileSectionItem from '../SectionItem';
import MobileListItem from '../ListItem';
import { Link } from 'react-router';

describe('<MobileSectionItem />', () => {
	before(() => {
		global.Keystone = {};
	});

	it('should render a react-router Link', () => {
		const component = shallow(<MobileSectionItem />);
		demand(component.find(Link).length).eql(1);
	});

	it('should render its children', () => {
		const children = (<h1>Hello World!</h1>);
		const component = shallow(
			<MobileSectionItem>{children}</MobileSectionItem>
		);

		demand(component.contains(children)).true();
	});

	it('should link to the href prop', () => {
		const href = 'someurl.com';
		const component = shallow(<MobileSectionItem href={href} />);

		demand(component.find(Link).length).eql(1);
		demand(component.find(Link).at(0).prop('to')).eql(href);
	});

	describe('lists', () => {
		it('should not render any lists if an empty array is passed', () => {
			const component = shallow(<MobileSectionItem lists={[]} />);
			demand(component.find(MobileListItem).length).eql(0);
		});

		it('should not render any lists if only one is passed', () => {
			const component = shallow(
				<MobileSectionItem
					lists={[{
						path: 'some/path',
					}]}
				/>
			);
			demand(component.find(MobileListItem).length).eql(0);
		});

		it('should render the lists if two are passed', () => {
			const component = shallow(
				<MobileSectionItem
					lists={[{
						path: 'some/path',
					}, {
						path: 'some/other/path',
					}]}
				/>
			);
			demand(component.find(MobileListItem).length).eql(2);
		});

		it('should highlight the current list', () => {
			const currentListPath = 'some/path';
			const component = shallow(
				<MobileSectionItem
					lists={[{
						path: currentListPath,
					}, {
						path: 'some/other/path',
					}]}
					currentListKey={currentListPath}
				/>
			);

			demand(component.find(MobileListItem).length).eql(2);
			demand(component.find(MobileListItem).at(0).prop('className'))
				.include('is-active');
		});
	});
});
