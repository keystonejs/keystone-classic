import React from 'react';

import { SegmentedControl } from 'elemental';

const EXISTS_OPTIONS = [
	{ label: 'Is Set', value: true },
	{ label: 'Is NOT Set', value: false },
];

function getDefaultValue () {
	return {
		exists: true,
	};
}

var PasswordFilter = React.createClass({
	propTypes: {
		filter: React.PropTypes.shape({
			exists: React.PropTypes.oneOf(EXISTS_OPTIONS.map(i => i.value)),
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
	toggleExists (value) {
		this.props.onChange({ exists: value });
	},
	render () {
		const { field, filter } = this.props;
		return <SegmentedControl equalWidthSegments options={EXISTS_OPTIONS} value={filter.exists} onChange={this.toggleExists} />;
	},
});

module.exports = PasswordFilter;
