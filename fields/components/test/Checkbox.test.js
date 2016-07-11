import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import Checkbox from '../Checkbox';

describe('<Checkbox/> tests', () => {
	describe('editable', function () {
		it('should render default state <button>', () => {
			const checkbox = shallow(<Checkbox />);
			demand(checkbox.type()).eql('button');
			demand(checkbox.prop('className')).eql('octicon');
		});

		it('should render checked state <button> ', () => {
			const checkbox = shallow(<Checkbox checked/>);
			demand(checkbox.type()).eql('button');
			demand(checkbox.prop('className')).eql('octicon octicon-check');
		});

		it('should deep equal when checked state is truthy to checked state is boolean true ', () => {
			const checkboxTrue = shallow(<Checkbox checked={true}/>); //eslint-disable-line
			const checkboxTruthy = shallow(<Checkbox checked/>);
			demand(checkboxTrue.html()).eql(checkboxTruthy.html());
		});
	});

	describe('readonly', function () {
		it('should render default state <span>', () => {
			const checkbox = shallow(<Checkbox readonly/>);
			demand(checkbox.type()).eql('span');
			demand(checkbox.prop('className')).eql('octicon');
		});

		it('should render checked state <span>', () => {
			const checkbox = shallow(<Checkbox readonly checked/>);
			demand(checkbox.type()).eql('span');
			demand(checkbox.prop('className')).eql('octicon octicon-check');
		});

		it('should render un-checked state <span>', () => {
			const checkbox = shallow(<Checkbox readonly checked={false}/>);
			demand(checkbox.type()).eql('span');
			demand(checkbox.prop('className')).eql('octicon octicon-x');
		});
	});
});
