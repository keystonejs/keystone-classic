import React from 'react';

import { SegmentedControl } from 'elemental';

const OPTIONS = [
	{ label: 'Is Set', value: true },
	{ label: 'Is NOT Set', value: false }
];

var PasswordFilter = React.createClass({

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
		return <SegmentedControl equalWidthSegments options={OPTIONS} value={this.state.checked} onChange={this.toggleChecked} />;
	}

});

module.exports = PasswordFilter;
