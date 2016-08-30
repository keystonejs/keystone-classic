import React from 'react';
import { findDOMNode } from 'react-dom';

import { FormField, FormInput, FormRow, FormSelect } from 'elemental';

const MODE_OPTIONS = [
	{ label: 'Exactly', value: 'equals' },
	{ label: 'Greater Than', value: 'gt' },
	{ label: 'Less Than', value: 'lt' },
	{ label: 'Between', value: 'between' },
];

const PRESENCE_OPTIONS = [
	{ label: 'At least one element', value: 'some' },
	{ label: 'No element', value: 'none' },
];

function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		presence: PRESENCE_OPTIONS[0].value,
		value: '',
	};
}

var NumberArrayFilter = React.createClass({
	propTypes: {
		filter: React.PropTypes.shape({
			mode: React.PropTypes.oneOf(MODE_OPTIONS.map(i => i.value)),
			presence: React.PropTypes.oneOf(PRESENCE_OPTIONS.map(i => i.value)),
			value: React.PropTypes.oneOf([
				React.PropTypes.string,
				React.PropTypes.shape({
					min: React.PropTypes.number,
					max: React.PropTypes.number,
				}),
			]),
		}),
	},
	statics: {
		getDefaultValue: getDefaultValue,
	},
	getDefaultProps () {
		return {
			filter: getDefaultValue(),
		};
	},
	// Returns a function that handles a specific type of onChange events for
	// either 'minValue', 'maxValue' or simply 'value'
	handleValueChangeBuilder (type) {
		var self = this;
		return function (e) {
			switch (type) {
				case 'minValue':
					self.updateFilter({
						value: {
							min: e.target.value,
							max: self.props.filter.value.max,
						},
					});
					break;
				case 'maxValue':
					self.updateFilter({
						value: {
							min: self.props.filter.value.min,
							max: e.target.value,
						},
					});
					break;
				case 'value':
					self.updateFilter({
						value: e.target.value,
					});
					break;
			}
		};
	},
	// Update the props with this.props.onChange
	updateFilter (changedProp) {
		this.props.onChange({ ...this.props.filter, ...changedProp });
	},
	// Update the filter mode
	selectMode (mode) {
		this.updateFilter({ mode });
		findDOMNode(this.refs.focusTarget).focus();
	},
	// Update the presence selection
	selectPresence (presence) {
		this.updateFilter({ presence });
		findDOMNode(this.refs.focusTarget).focus();
	},
	// Render the controls, showing two inputs when the mode is "between"
	renderControls (presence, mode) {
		let controls;
		const placeholder = presence.label + ' is ' + mode.label.toLowerCase() + '...';

		if (mode.value === 'between') {
			// Render "min" and "max" input
			controls = (
				<FormRow>
					<FormField width="one-half" style={{ marginBottom: 0 }}>
						<FormInput
							type="number"
							ref="focusTarget"
							placeholder="Min."
							onChange={this.handleValueChangeBuilder('minValue')}
							value={this.props.filter.value.min}
						/>
					</FormField>
					<FormField width="one-half" style={{ marginBottom: 0 }}>
						<FormInput
							type="number"
							placeholder="Max."
							onChange={this.handleValueChangeBuilder('maxValue')}
							value={this.props.filter.value.max}
						/>
					</FormField>
				</FormRow>
			);
		} else {
			// Render one number input
			controls = (
				<FormField>
					<FormInput
						type="number"
						ref="focusTarget"
						placeholder={placeholder}
						onChange={this.handleValueChangeBuilder('value')}
						value={this.props.filter.value}
					/>
				</FormField>
			);
		}

		return controls;
	},
	render () {
		const { filter } = this.props;
		// Get mode and presence based on their values with .filter
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
		const presence = PRESENCE_OPTIONS.filter(i => i.value === filter.presence)[0];

		return (
			<div>
				<FormSelect options={PRESENCE_OPTIONS} onChange={this.selectPresence} value={presence.value} />
				<FormSelect options={MODE_OPTIONS} onChange={this.selectMode} value={mode.value} />
				{this.renderControls(presence, mode)}
			</div>
		);
	},

});

module.exports = NumberArrayFilter;
