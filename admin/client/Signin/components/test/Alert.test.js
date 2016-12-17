import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import { Alert } from '../../../App/elemental';
import AlertView from '../Alert';

describe('<Alert />', () => {
	it('should render an empty span if no props are specified', () => {
		const component = shallow(<AlertView />);
		demand(component.equals(<span />)).true();
	});

	it('should render an error Alert if isInvalid is supplied', () => {
		const component = shallow(<AlertView isInvalid />);
		demand(component.find(Alert).length).eql(1);
		demand(component.find(Alert).prop('color')).eql('danger');
	});

	it('should render the error message in invalidMessage if isInvalid is supplied', () => {
		const invalidMessage = 'Some error has happened.';
		const component = shallow(
			<AlertView
				isInvalid
				invalidMessage={invalidMessage}
			/>
		);
		demand(component.contains(invalidMessage)).true();
	});

	it('should render an info Alert if signedOut is true', () => {
		const component = shallow(<AlertView signedOut />);
		demand(component.find(Alert).length).eql(1);
		demand(component.find(Alert).prop('color')).eql('info');
	});

	it('should render a signed out text when signedOut is true', () => {
		const component = shallow(<AlertView signedOut />);
		demand(component.find(Alert).length).eql(1);
		demand(component.find(Alert).contains('You have been signed out.')).true();
	});
});
