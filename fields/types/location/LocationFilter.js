import React from 'react';

import { FormField, FormInput, FormRow, SegmentedControl } from 'elemental';

const TOGGLE_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true },
];

function getDefaultValue () {
	return {
		inverted: TOGGLE_OPTIONS[0].value,
		street: undefined,
		city: undefined,
		state: undefined,
		code: undefined,
		country: undefined,
	};
}

var TextFilter = React.createClass({
	propTypes: {
		filter: React.PropTypes.shape({
			inverted: React.PropTypes.boolean,
			street: React.PropTypes.string,
			city: React.PropTypes.string,
			state: React.PropTypes.string,
			code: React.PropTypes.string,
			country: React.PropTypes.string,
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
	updateFilter (key, val) {
		let update = {};
		update[key] = val;
		this.props.onChange(Object.assign(this.props.filter, update));
	},
	toggleInverted (value) {
		this.updateFilter('inverted', value);
		this.refs.focusTarget.focus();
	},
	updateValue (e) {
		this.updateFilter(e.target.name, e.target.value);
	},
	render () {
		let { filter } = this.props;

		return (
			<div>
				<FormField>
					<SegmentedControl equalWidthSegments options={TOGGLE_OPTIONS} value={filter.inverted} onChange={this.toggleInverted} />
				</FormField>
				<FormField>
					<FormInput autofocus ref="focusTarget" value={filter.street} onChange={this.updateValue} name="street" placeholder="Address" />
				</FormField>
				<FormRow>
					<FormField width="two-thirds">
						<FormInput value={filter.city} onChange={this.updateValue} name="city" placeholder="City" />
					</FormField>
					<FormField width="one-third">
						<FormInput value={filter.state} onChange={this.updateValue} name="state" placeholder="State" />
					</FormField>
					<FormField width="one-third" style={{ marginBottom: 0 }}>
						<FormInput value={filter.code} onChange={this.updateValue} name="code" placeholder="Postcode" />
					</FormField>
					<FormField width="two-thirds" style={{ marginBottom: 0 }}>
						<FormInput value={filter.country} onChange={this.updateValue} name="country" placeholder="Country" />
					</FormField>
				</FormRow>
			</div>
		);
	},
});

module.exports = TextFilter;
