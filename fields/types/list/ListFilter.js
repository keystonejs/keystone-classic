/*
TODO: Not sure what this should look like yet,
      it's currently basically a copy of the Boolean filter
      so that the Admin UI builds successfully
*/

import React from 'react';
import { SegmentedControl } from 'elemental';

const VALUE_OPTIONS = [
	{ label: 'Has Values', value: true },
	{ label: 'Is Empty', value: false },
];

function getDefaultValue () {
	return {
		value: true,
	};
}

var ListFilter = React.createClass({
	propTypes: {
		filter: React.PropTypes.shape({
			value: React.PropTypes.bool,
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
	updateValue (value) {
		this.props.onChange({ value });
	},
	render () {
		return <SegmentedControl equalWidthSegments options={VALUE_OPTIONS} value={this.props.filter.value} onChange={this.updateValue} />;
	},
});

module.exports = ListFilter;
