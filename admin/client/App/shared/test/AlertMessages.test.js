import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import AlertMessages from '../AlertMessages';
import { Alert } from '../../elemental';

describe('<AlertMessages />', () => {
	it('should render null if no message is passed', () => {
		const component = shallow(<AlertMessages />);
		demand(component.type()).eql(null);
	});

	// TODO needs to be fixed
	it.skip('should render a success Alert on success', () => {
		const component = shallow(
			<AlertMessages
				alerts={{
					success: {
						success: 'Something went right!',
					},
				}}
			/>
		);
		demand(component.find(Alert).length).gt(0);
		demand(component.find({ type: 'success' }).length).gt(0);
	});

	// TODO needs to be fixed
	it.skip('should render an error message', () => {
		const errorMsg = 'Something went wrong!';
		const component = shallow(
			<AlertMessages
				alerts={{
					error: {
						error: errorMsg,
					},
				}}
			/>
		);
		demand(component.find(Alert).length).gt(0);
		demand(component.find({ type: 'danger' }).length).gt(0);
		demand(component.contains(errorMsg)).true();
	});

	// TODO needs to be fixed
	it.skip('should render "error" if no validation error is specified', () => {
		const errorMsg = 'error';
		const component = shallow(
			<AlertMessages
				alerts={{
					error: {
						error: errorMsg,
						detail: {
							name: 'Not A ValidationError',
						},
					},
				}}
			/>
		);
		demand(component.find(Alert).length).gt(0);
		demand(component.find({ type: 'danger' }).length).gt(0);
		demand(component.contains('Error')).true();
	});

	// TODO needs to be fixed
	it.skip('should render a single validation error', () => {
		const errorPath = 'some/path';
		const errorMsg = 'Some Validation Error';
		const component = shallow(
			<AlertMessages
				alerts={{
					error: {
						error: 'validation errors',
						detail: {
							[errorPath]: {
								error: errorMsg,
							},
						},
					},
				}}
			/>
		);
		demand(component.contains(errorMsg)).true();
	});

	// TODO needs to be fixed
	it.skip('should render a single validation error passed in a different format', () => {
		const errorPath = 'some/path';
		const errorMsg = 'Some error message';
		const component = shallow(
			<AlertMessages
				alerts={{
					error: {
						error: errorMsg,
						detail: {
							name: 'ValidationError',
							errors: {
								[errorPath]: {
									error: errorMsg,
								},
							},
						},
					},
				}}
			/>
		);
		demand(component.contains(errorMsg)).true();
	});

	it('should render multiple validation errors', () => {
		const errors = {
			'some/path': {
				error: 'Some Validation Error',
			},
			'some/other/path': {
				error: 'Some Other Validation Error',
			},
		};
		const component = shallow(
			<AlertMessages
				alerts={{
					error: {
						error: 'validation errors',
						detail: errors,
					},
				}}
			/>
		);

		demand(component.contains(errors['some/path'].error)).true();
		demand(component.contains(errors['some/other/path'].error)).true();
		demand(component.find('li').length).equal(2);
	});
});
