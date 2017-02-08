import React from 'react';
import { findDOMNode } from 'react-dom';

import {
	FormField,
	FormInput,
	FormSelect,
	Grid,
} from '../../../admin/client/App/elemental';

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
			value: React.PropTypes.oneOfType([
				React.PropTypes.number,
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
	selectMode (e) {
		const mode = e.target.value;
		this.updateFilter({ mode });
		findDOMNode(this.refs.focusTarget).focus();
	},
	// Update the presence selection
	selectPresence (e) {
		const presence = e.target.value;
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
				<Grid.Row xsmall="one-half" gutter={10}>
					<Grid.Col>
						<FormInput
							onChange={this.handleValueChangeBuilder('minValue')}
							placeholder="Min."
							ref="focusTarget"
							type="number"
							value={this.props.filter.value.min}
						/>
					</Grid.Col>
					<Grid.Col>
						<FormInput
							onChange={this.handleValueChangeBuilder('maxValue')}
							placeholder="Max."
							type="number"
							value={this.props.filter.value.max}
						/>
					</Grid.Col>
				</Grid.Row>
			);
		} else {
			// Render one number input
			controls = (
				<FormInput
					onChange={this.handleValueChangeBuilder('value')}
					placeholder={placeholder}
					ref="focusTarget"
					type="number"
					value={this.props.filter.value}
				/>
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
				<FormField>
					<FormSelect
						onChange={this.selectPresence}
						options={PRESENCE_OPTIONS}
						value={presence.value}
					/>
				</FormField>
				<FormField>
					<FormSelect
						onChange={this.selectMode}
						options={MODE_OPTIONS}
						value={mode.value}
					/>
				</FormField>
				{this.renderControls(presence, mode)}
			</div>
		);
	},

});

module.exports = NumberArrayFilter;
