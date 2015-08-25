import _ from 'underscore';
import classNames from 'classnames';
import React from 'react';

import { FormField, FormInput, FormRow, SegmentedControl } from 'elemental';

const MODE_OPTIONS = [
	{ label: 'Exactly',     value: 'exactly' },
	{ label: 'Contains',    value: 'contains' }
];

const TOGGLE_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true }
];

var TextFilter = React.createClass({

	getInitialState () {
		return {
			inverted: TOGGLE_OPTIONS[0].value,
			city: '',
			state: '',
			code: '',
			country: ''
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

	render () {
		let { modeLabel, modeValue } = this.state;

		return (
			<div>
				<FormField>
					<SegmentedControl equalWidthSegments options={TOGGLE_OPTIONS} value={this.state.inverted} onChange={this.toggleInverted} />
				</FormField>
				<FormField>
					<FormInput ref="focusTarget" placeholder="Address" />
				</FormField>
				<FormRow>
					<FormField width="two-thirds">
						<FormInput placeholder="City" value={this.state.city} />
					</FormField>
					<FormField width="one-third">
						<FormInput placeholder="State" value={this.state.state} />
					</FormField>
					<FormField width="one-third" style={{ marginBottom: 0 }}>
						<FormInput placeholder="Postcode" value={this.state.code} />
					</FormField>
					<FormField width="two-thirds" style={{ marginBottom: 0 }}>
						<FormInput placeholder="Country" value={this.state.country} />
					</FormField>
				</FormRow>
			</div>
		);
	}

});

module.exports = TextFilter;
