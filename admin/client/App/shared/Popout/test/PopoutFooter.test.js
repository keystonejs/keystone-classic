import React from 'react';
import { shallow } from 'enzyme';
import demand from 'must';
import PopoutFooter from '../PopoutFooter';

describe('<PopoutFooter />', () => {
	it('should render a div', () => {
		const component = shallow(<PopoutFooter />);
		demand(component.find('div').length).eql(1);
	});

	it('should render its children', () => {
		const children = (<h1>Hello World!</h1>);
		const component = shallow(
			<PopoutFooter>{children}</PopoutFooter>
		);

		demand(component.contains(children)).true();
	});

	describe('buttons', () => {
		it('should render a primary button', () => {
			const label = 'Some action';
			const component = shallow(
				<PopoutFooter primaryButtonLabel={label} />
			);

			demand(component.find('button').length).eql(1);
			demand(component.find('button').at(0).contains(label)).true();
		});

		it('should render a submit button', () => {
			const label = 'Some action';
			const component = shallow(
				<PopoutFooter primaryButtonLabel={label} primaryButtonIsSubmit />
			);

			demand(component.find('button').length).eql(1);
			demand(component.find('button').prop('type')).eql('submit');
		});

		it('should render a secondary button', () => {
			const label = 'Some action';
			const component = shallow(
				<PopoutFooter
					secondaryButtonLabel={label}
					secondaryButtonAction={function () {}}
				/>
			);

			demand(component.find('button').length).eql(1);
			demand(component.find('button').at(0).contains(label)).true();
		});
	});
});
