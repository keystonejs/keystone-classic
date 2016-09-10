import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import FlashMessage from '../FlashMessage';

import FlashMessages from '../FlashMessages';

describe('<FlashMessages />', () => {
	it('should render null if no messages are provided', () => {
		const component = shallow(<FlashMessages />);
		demand(component.type()).eql(null);
	});

	it('should render an empty div if theres no messages in a type', () => {
		const component = shallow(<FlashMessages messages />);
		demand(component.find('div').length).eql(1);
	});

	describe('messages', () => {
		it('should render an error message as a FlashMessage', () => {
			const messages = {
				error: [{
					title: 'Some error',
				}],
			};
			const component = shallow(
				<FlashMessages
					messages={messages}
				/>
			);

			demand(component.find(FlashMessage).length).eql(messages.error.length);
			demand(component.find(FlashMessage).at(0).prop('type'))
				.eql('error');
			demand(component.find(FlashMessage).at(0).prop('message'))
				.eql(messages.error[0]);
		});

		it('should render multple error messages', () => {
			const messages = {
				error: [{
					title: 'Some error',
				}, {
					title: 'Some other error',
				}, {
					title: 'And another one,',
				}],
			};
			const component = shallow(
				<FlashMessages
					messages={messages}
				/>
			);

			demand(component.find(FlashMessage).length).eql(messages.error.length);
			demand(component.find(FlashMessage).at(0).prop('type'))
				.eql('error');
			demand(component.find(FlashMessage).at(0).prop('message'))
				.eql(messages.error[0]);
			demand(component.find(FlashMessage).at(1).prop('type'))
				.eql('error');
			demand(component.find(FlashMessage).at(1).prop('message'))
				.eql(messages.error[1]);
			demand(component.find(FlashMessage).at(2).prop('type'))
				.eql('error');
			demand(component.find(FlashMessage).at(2).prop('message'))
				.eql(messages.error[2]);
		});
	});
});
