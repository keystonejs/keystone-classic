import React from 'react';
import demand from 'must';
import ListTile from '../ListTile';
import { shallow } from 'enzyme';

import { Link } from 'react-router';

describe('<ListTile />', () => {
	it('should render a div', () => {
		const component = shallow(<ListTile />);
		demand(component.find('div').length).gt(0);
	});

	it('should attach the data-list-path for e2e testing', () => {
		const path = 'some/path';
		const component = shallow(<ListTile path={path} />);
		demand(component.find('div').at(0).prop('data-list-path')).eql(path);
	});

	it('should have a link to props.href', () => {
		const href = 'someurl.com';
		const component = shallow(<ListTile href={href} />);
		demand(component.find(Link).at(0).prop('to')).eql(href);
	});

	it('should render its label', () => {
		const label = 'Some List';
		const component = shallow(<ListTile label={label} />);
		demand(component.contains(label)).true();
	});

	it('should render a spinner if no counts are available', () => {
		const spinner = 'Some Spinner Component';
		const component = shallow(<ListTile spinner={spinner} />);
		demand(component.contains(spinner)).true();
	});

	it('should render the count when they are available', () => {
		const count = 100;
		const component = shallow(
			<ListTile
				count={count}
			/>
		);
		demand(component.contains(count)).true();
	});

	it('should render a create button', () => {
		const component = shallow(<ListTile />);
		demand(component.find(Link).at(1).prop('to')).include('?create');
	});

	it('should not render a create button if instructed', () => {
		const component = shallow(<ListTile hideCreateButton />);
		demand(component.find(Link).at(1).prop('to')).not.include('?create');
	});
});
