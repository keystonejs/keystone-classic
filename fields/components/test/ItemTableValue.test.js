import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import ItemsTableValue from '../ItemsTableValue';

describe('<ItemsTableValue/> tests', () => {
	it('should render <div> with default properties and css class', () => {
		const tableValue = shallow(<ItemsTableValue/>);

		demand(tableValue.find('div').type()).eql('div');
		demand(tableValue.find('div').length).eql(1);
		demand(tableValue.find('.ItemList__value').length).eql(1);
		demand(tableValue.find('.ItemList__value--truncate').length).eql(1);
		demand(tableValue.prop('children')).to.be.undefined();
	});

	it('should render <div> with explicit properties and css class', () => {
		const tableValue = shallow(
			<ItemsTableValue
				className="mock-class"
				field="mock-file-upload"
				interior
				padded
				truncate={false}
			/>
		);

		demand(tableValue.find('.ItemList__value--truncate').length).eql(0);
		demand(tableValue.find('.ItemList__value .ItemList__value--mock-file-upload .mock-class').length).eql(1);
	});

	it('should render <Link> with default properties and css class', () => {
		const actualUrl = 'http://hello.world';
		const tableValue = shallow(<ItemsTableValue to={actualUrl} />);

		demand(tableValue.name()).eql('Link');
		demand(tableValue.prop('href')).eql(actualUrl);
		demand(tableValue.find('.ItemList__value .ItemList__value--truncate').length).eql(1);
	});

	it('should render <Link> with explicit properties and css class', () => {
		const tableValue = shallow(
			<ItemsTableValue
				href="http://hello.world"
				field="mock-file-upload"
				interior
				padded
				truncate={false}
			/>
		);

		demand(tableValue.name()).eql('Link');
		demand(tableValue.find('.ItemList__value--truncate').length).eql(0);
		demand(tableValue.find('.ItemList__value .ItemList__value--mock-file-upload .ItemList__link--interior .ItemList__link--padded').length).eql(1);
	});

	it('should render <div> with child', () => {
		const actualText = 'mock-span-text';
		const tableValue = shallow(
			<ItemsTableValue>
				<span>{actualText}</span>
			</ItemsTableValue>
		);
		const child = tableValue.prop('children');

		demand(tableValue.find('div').type()).eql('div');
		demand(tableValue.find('div').length).eql(1);
		demand(tableValue.find('.ItemList__value').length).eql(1);
		demand(tableValue.find('.ItemList__value--truncate').length).eql(1);
		demand(child.type).eql('span');
		demand(child.props.children).eql(actualText);
	});
});
