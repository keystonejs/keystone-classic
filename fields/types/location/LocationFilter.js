import _ from 'underscore';
import classNames from 'classnames';
import React from 'react';

import { FormField, FormInput, FormRow, SegmentedControl } from 'elemental';

const MODE_OPTIONS = [
	{ label: 'Exactly',     value: 'exactly' },
	{ label: 'Contains',    value: 'contains' }
];

var TextFilter = React.createClass({

	getInitialState () {
		return {
			inverted: false,
			value: ''
		};
	},

	componentDidMount () {
		// focus the text focusTarget
		React.findDOMNode(this.refs.focusTarget).focus();
	},

	toggleInverted (value) {
		this.setState({
			inverted: value
		});
	},

	renderToggle () {
		let options = [
			{ label: 'Matches', value: false },
			{ label: 'Does NOT Match', value: true }
		];

		return <SegmentedControl equalWidthSegments type="primary" options={options} value={this.state.inverted} onChange={this.toggleInverted} />;
	},

	render () {
		let { modeLabel, modeValue } = this.state;

		return (
			<div>
				{this.renderToggle()}
				<FormField>
					<FormInput ref="focusTarget" placeholder="Address" />
				</FormField>
				<FormRow>
					<FormField width="two-thirds">
						<FormInput placeholder="City" />
					</FormField>
					<FormField width="one-third">
						<FormInput placeholder="State" />
					</FormField>
					<FormField width="one-third">
						<FormInput placeholder="Zip Code" />
					</FormField>
					<FormField width="two-thirds">
						<FormInput placeholder="Country" />
					</FormField>
				</FormRow>
			</div>
		);
	}

});

module.exports = TextFilter;
