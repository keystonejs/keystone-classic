import React from 'react';
import ReactDOM from 'react-dom';

import { FormField, FormInput, FormRow, FormSelect } from 'elemental';

const CONTROL_OPTIONS = [
	{ label: 'Exactly', value: 'exactly' },
	{ label: 'Greater Than', value: 'greaterThan' },
	{ label: 'Less Than', value: 'lessThan' },
	{ label: 'Between', value: 'between' }
];

var NumberFilter = React.createClass({

	getInitialState () {
		return {
			modeValue: CONTROL_OPTIONS[0].value, // 'matches'
			modeLabel: CONTROL_OPTIONS[0].label, // 'Matches'
			value: ''
		};
	},

	componentDidMount () {
		// focus the text input
		ReactDOM.findDOMNode(this.refs.input).focus();
	},

	toggleMode (mode) {
		this.setState({
			modeValue: mode,
			modeLabel: CONTROL_OPTIONS.find(option => option.value === mode).label
		});

		// focus the text input after a mode selection is made
		ReactDOM.findDOMNode(this.refs.input).focus();
	},

	renderControls () {
		let controls;
		let { field } = this.props;
		let { modeLabel, modeValue } = this.state;
		let placeholder = field.label + ' is ' + modeLabel.toLowerCase() + '...';

		if (modeValue === 'between') {
			controls = (
				<FormRow>
					<FormField width="one-half" style={{ marginBottom: 0 }}>
						<FormInput type="number" ref="input" placeholder="Min." />
					</FormField>
					<FormField width="one-half" style={{ marginBottom: 0 }}>
						<FormInput type="number" placeholder="Max." />
					</FormField>
				</FormRow>
			);
		} else {
			controls = (
				<FormField>
					<FormInput type="number" ref="input" placeholder={placeholder} />
				</FormField>
			);
		}

		return controls;
	},

	render () {
		let { modeValue } = this.state;

		return (
			<div>
				<FormSelect options={CONTROL_OPTIONS} onChange={this.toggleMode} value={modeValue} />
				{this.renderControls()}
			</div>
		);
	}

});

module.exports = NumberFilter;
