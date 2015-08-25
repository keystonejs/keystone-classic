import _ from 'underscore';
import classNames from 'classnames';
import React from 'react';

import { FormField, FormInput, FormRow, FormSelect, SegmentedControl } from 'elemental';

const TOGGLE_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true }
];

const MODE_OPTIONS = [
	{ label: 'On',      value: 'on' },
	{ label: 'After',   value: 'after' },
	{ label: 'Before',  value: 'before' },
	{ label: 'Between', value: 'between' }
];

var NumberFilter = React.createClass({

	getInitialState () {
		return {
			modeValue: MODE_OPTIONS[0].value, // 'on'
			modeLabel: MODE_OPTIONS[0].label, // 'On'
			inverted: TOGGLE_OPTIONS[0].value,
			value: ''
		};
	},

	componentDidMount () {
		// focus the text input
		React.findDOMNode(this.refs.input).focus();
	},

	toggleInverted (value) {
		this.setState({
			inverted: value
		});
	},

	selectMode (mode) {
		// TODO: implement w/o underscore
		this.setState({
			modeValue: mode,
			modeLabel: _.findWhere(MODE_OPTIONS, { value: mode }).label
		});

		// focus the text input after a mode selection is made
		React.findDOMNode(this.refs.input).focus();
	},

	renderToggle () {
		return (
			<FormField>
				<SegmentedControl equalWidthSegments options={TOGGLE_OPTIONS} value={this.state.inverted} onChange={this.toggleInverted} />
			</FormField>
		);
	},

	renderControls () {
		let controls;
		let { field } = this.props;
		let { modeLabel, modeValue } = this.state;
		let placeholder = field.label + ' is ' + modeLabel.toLowerCase() + '...';

		if (modeValue === 'between') {
			controls = (
				<FormRow>
					<FormField width="one-half">
						<FormInput ref="input" placeholder="From" />
					</FormField>
					<FormField width="one-half">
						<FormInput placeholder="To" />
					</FormField>
				</FormRow>
			);
		} else {
			controls = (
				<FormField>
					<FormInput ref="input" placeholder={placeholder} />
				</FormField>
			);
		}

		return controls;
	},

	render () {
		let { modeLabel, modeValue } = this.state;

		return (
			<div>
				{this.renderToggle()}
				<FormSelect options={MODE_OPTIONS} onChange={this.selectMode} value={modeValue} />
				{this.renderControls()}
			</div>
		);
	}

});

module.exports = NumberFilter;
