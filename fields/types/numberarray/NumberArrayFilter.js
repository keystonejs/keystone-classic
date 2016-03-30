import React from 'react';
import ReactDOM from 'react-dom';

import { FormField, FormInput, FormRow, FormSelect } from 'elemental';

const CONTROL_OPTIONS = [
	{ label: 'Exactly', value: 'equals' },
	{ label: 'Greater Than', value: 'gt' },
	{ label: 'Less Than', value: 'lt' },
	{ label: 'Between', value: 'between' },
];

const PRESENCE_OPTIONS = [
	{ label: 'At least one element', value: 'some' },
	{ label: 'No element', value: 'none' },
];

var NumberArrayFilter = React.createClass({

	getInitialState () {
		return {
			modeValue: CONTROL_OPTIONS[0].value, // 'equals'
			modeLabel: CONTROL_OPTIONS[0].label, // 'Exactly'
			presenceValue: PRESENCE_OPTIONS[0].value,
			presenceLabel: PRESENCE_OPTIONS[0].label,
			value: '',
			minValue: '',
			maxValue: '',
		};
	},

	componentDidMount () {
		// focus the text input
		ReactDOM.findDOMNode(this.refs.input).focus();
	},

	handleChangeBuilder (type) {
		const self = this;
		return function handleChange (e) {
			const { value } = e.target;
			const { modeValue, presenceValue } = self.state;
			const { onChange } = self.props;
			self.setState({
				[type]: value,
			});

			switch (type) {
				case 'minValue':
					onChange({
						mode: modeValue,
						presence: presenceValue,
						value: {
							min: value,
							max: self.state.maxValue,
						},
					});
					break;
				case 'maxValue':
					onChange({
						mode: modeValue,
						presence: presenceValue,
						value: {
							max: value,
							min: self.state.minValue,
						},
					});
					break;
				case 'value':
					onChange({
						mode: modeValue,
						presence: presenceValue,
						value,
					});
			}
		};
	},

	toggleMode (mode) {
		this.setState({
			modeValue: mode,
			modeLabel: CONTROL_OPTIONS.find(option => option.value === mode).label,
		});

		// focus the text input after a mode selection is made
		ReactDOM.findDOMNode(this.refs.input).focus();
	},

	togglePresence (presence) {
		this.setState({
			presenceValue: presence,
			presenceLabel: PRESENCE_OPTIONS.find(currPresence => currPresence.value === presence).label,
		});

		// focus the text input after a presence choice is made
		ReactDOM.findDOMNode(this.refs.input).focus();
	},

	renderControls () {
		let controls;
		const { field } = this.props;
		const { modeLabel, modeValue, presenceLabel, presenceValue } = this.state;
		const placeholder = presenceLabel + ' is ' + modeLabel.toLowerCase() + '...';

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
		const { modeValue, presenceValue } = this.state;

		return (
			<div>
				<FormSelect options={PRESENCE_OPTIONS} 	onChange={this.togglePresence} value={presenceValue} />
				<FormSelect options={CONTROL_OPTIONS} onChange={this.toggleMode} value={modeValue} />
				{this.renderControls()}
			</div>
		);
	},

});

module.exports = NumberArrayFilter;
