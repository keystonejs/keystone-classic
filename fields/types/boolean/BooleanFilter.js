import React from 'react';
import { SegmentedControl } from 'elemental';

const TOGGLE_OPTIONS = [
	{ label: 'Is Checked', value: true },
	{ label: 'Is NOT Checked', value: false }
];

var BooleanFilter = React.createClass({

	getInitialState () {
		return {
			checked: this.props.value || TOGGLE_OPTIONS[0].value
		};
	},

	toggleChecked (checked) {
		this.setState({
			checked: checked
		});
	},
	render () {
		return <SegmentedControl equalWidthSegments options={TOGGLE_OPTIONS} value={this.state.checked} onChange={this.toggleChecked} />;
	}

});

module.exports = BooleanFilter;
