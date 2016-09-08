import React from 'react';
import { findDOMNode } from 'react-dom';

import {
	FormField,
	FormInput,
	GridCol,
	GridRow,
	SegmentedControl,
} from '../../../admin/client/App/elemental';

const INVERTED_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true },
];

function getDefaultValue () {
	return {
		inverted: INVERTED_OPTIONS[0].value,
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
		const update = {};
		update[key] = val;
		this.props.onChange(Object.assign(this.props.filter, update));
	},
	toggleInverted (value) {
		this.updateFilter('inverted', value);
		findDOMNode(this.refs.focusTarget).focus();
	},
	updateValue (e) {
		this.updateFilter(e.target.name, e.target.value);
	},
	render () {
		const { filter } = this.props;

		return (
			<div>
				<FormField>
					<SegmentedControl
						equalWidthSegments
						onChange={this.toggleInverted}
						options={INVERTED_OPTIONS}
						value={filter.inverted}
					/>
				</FormField>
				<FormField>
					<FormInput
						autoFocus
						name="street"
						onChange={this.updateValue}
						placeholder="Address"
						ref="focusTarget"
						value={filter.street}
					/>
				</FormField>
				<GridRow gutter={10}>
					<GridCol xsmall="two-thirds">
						<FormInput
							name="city"
							onChange={this.updateValue}
							placeholder="City"
							style={{ marginBottom: '1em' }}
							value={filter.city}
						/>
					</GridCol>
					<GridCol xsmall="one-third">
						<FormInput
							name="state"
							onChange={this.updateValue}
							placeholder="State"
							style={{ marginBottom: '1em' }}
							value={filter.state}
						/>
					</GridCol>
					<GridCol xsmall="one-third" style={{ marginBottom: 0 }}>
						<FormInput
							name="code"
							onChange={this.updateValue}
							placeholder="Postcode"
							value={filter.code}
						/>
					</GridCol>
					<GridCol xsmall="two-thirds" style={{ marginBottom: 0 }}>
						<FormInput
							name="country"
							onChange={this.updateValue}
							placeholder="Country"
							value={filter.country}
						/>
					</GridCol>
				</GridRow>
			</div>
		);
	},
});

module.exports = TextFilter;
