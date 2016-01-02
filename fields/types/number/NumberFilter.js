import React from 'react';
import ReactDOM from 'react-dom';

import { FormField, FormInput, FormRow, FormSelect } from 'elemental';

const CONTROL_OPTIONS = [
	{ label: 'Exactly', value: 'equals' },
	{ label: 'Greater Than', value: 'gt' },
	{ label: 'Less Than', value: 'lt' },
	{ label: 'Between', value: 'between' }
];

var NumberFilter = React.createClass({

	getInitialState () {
		return {
			modeValue: CONTROL_OPTIONS[0].value, // 'matches'
			modeLabel: CONTROL_OPTIONS[0].label, // 'Matches'
			value: '',
			minValue: '',
			maxValue: ''
		};
	},

	componentDidMount () {
		// focus the text input
		ReactDOM.findDOMNode(this.refs.input).focus();
	},

	handleChangeBuilder (type) {
		let self = this;
		return function handleChange (e) {
			let { value } = e.target;
			let { modeValue } = self.state;
			let { onChange } = self.props;
			self.setState({
				[type]: value
			});

			switch(type) {
				case 'minValue':
					onChange({
						mode: modeValue,
						value: {
							min: value,
							max: self.state.maxValue
						}
					});
					break;
				case 'maxValue':
					onChange({
						mode: modeValue,
						value: {
							max: value,
							min: self.state.minValue
						}
					});
					break;
				case 'value':
					onChange({
						mode: modeValue,
						value
					});
			}
		};
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
						<FormInput type="number" ref="input" placeholder="Min." onChange={this.handleChangeBuilder('minValue')} />
					</FormField>
					<FormField width="one-half" style={{ marginBottom: 0 }}>
						<FormInput type="number" placeholder="Max." onChange={this.handleChangeBuilder('maxValue')} />
					</FormField>
				</FormRow>
			);
		} else {
			controls = (
				<FormField>
					<FormInput type="number" ref="input" placeholder={placeholder} onChange={this.handleChangeBuilder('value')} />
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
