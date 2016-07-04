import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import ItemsTableCell from '../ItemsTableCell';

describe('<ItemsTableCell/> tests', () => {
	it('should render <td> with default class and properties', () => {
		const cell = shallow(<ItemsTableCell/>);
		demand(cell.find('td').type()).eql('td');
		demand(cell.find('td').length).eql(1);
		demand(cell.find('.ItemList__col').length).eql(1);
		demand(cell.prop('className')).eql('ItemList__col ');
	});

	it('should render <td> with properties p1, p2', () => {
		const cell = shallow(<ItemsTableCell p1="v1" p2="v2"/>);
		demand(cell.prop('p1')).eql('v1');
		demand(cell.prop('p2')).eql('v2');
	});

	it('should render <td> with css class mock-style', () => {
		const cell = shallow(<ItemsTableCell className="mock-style"/>);
		demand(cell.find('.mock-style').length).eql(1);
		demand(cell.find('.ItemList__col').length).eql(1);
	});
});
