import React from 'react';

import { SegmentedControl } from 'elemental';

var BooleanFilter = React.createClass({

	getInitialState () {
		return {
			checked: this.props.value || true
		};
	},

	toggleChecked (checked) {
		this.setState({
			checked: checked
		});
	},
	render () {
		let options = [
			{ label: 'Is Checked', value: true },
			{ label: 'Is NOT Checked', value: false }
		];

		return <SegmentedControl equalWidthSegments type="primary" options={options} value={this.state.checked} onChange={this.toggleChecked} />;
	}

});

module.exports = BooleanFilter;
