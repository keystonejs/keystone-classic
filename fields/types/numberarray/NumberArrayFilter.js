import React from 'react';
import ReactDOM from 'react-dom';

import { FormField, FormInput, FormRow, FormSelect } from 'elemental';

const CONTROL_OPTIONS = [
	{ label: 'Exactly', value: 'equals' },
	{ label: 'Greater Than', value: 'gt' },
	{ label: 'Less Than', value: 'lt' },
	{ label: 'Between', value: 'between' },
];

const SELECTION_OPTIONS = [
	{ label: 'All elements', value: 'all' },
	{ label: 'At least one element', value: 'moreThan' },
	{ label: 'No element', value: 'none' },
];

var NumberArrayFilter = React.createClass({

	getInitialState () {
		return {
			modeValue: CONTROL_OPTIONS[0].value, // 'matches'
			modeLabel: CONTROL_OPTIONS[0].label, // 'Matches'
			selectionValue: SELECTION_OPTIONS[0].value,
			selectionLabel: SELECTION_OPTIONS[0].label,
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
			const { modeValue, selectionValue } = self.state;
			const { onChange } = self.props;
			self.setState({
				[type]: value,
			});

			switch (type) {
				case 'minValue':
					onChange({
						mode: modeValue,
						selection: selectionValue,
						value: {
							min: value,
							max: self.state.maxValue,
						},
					});
					break;
				case 'maxValue':
					onChange({
						mode: modeValue,
						selection: selectionValue,
						value: {
							max: value,
							min: self.state.minValue,
						},
					});
					break;
				case 'value':
					onChange({
						mode: modeValue,
						selection: selectionValue,
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

	toggleSelection (selection) {
		this.setState({
			selectionValue: selection,
			selectionLabel: SELECTION_OPTIONS.find(currSelection => currSelection.value === selection).label,
		});

		// focus the text input after a selection choice is made
		ReactDOM.findDOMNode(this.refs.input).focus();
	},

	renderControls () {
		let controls;
		const { field } = this.props;
		const { modeLabel, modeValue, selectionLabel, selectionValue } = this.state;
		const beingVerb = selectionValue === 'all' ? ' are ' : ' is ';
		const placeholder = selectionLabel + beingVerb + modeLabel.toLowerCase() + '...';

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
		const { modeValue, selectionValue } = this.state;

		return (
			<div>
				<FormSelect options={CONTROL_OPTIONS} onChange={this.toggleMode} value={modeValue} />
				<FormSelect options={SELECTION_OPTIONS} onChange={this.toggleSelection} value={selectionValue} />
				{this.renderControls()}
			</div>
		);
	},

});

module.exports = NumberArrayFilter;
