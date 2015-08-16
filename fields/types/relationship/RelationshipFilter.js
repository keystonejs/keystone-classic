import React from 'react';

import { SegmentedControl } from 'elemental';

const TOGGLE_OPTIONS = [
	{ label: 'Linked To', value: true },
	{ label: 'NOT Linked To', value: false }
];

var RelationshipFilter = React.createClass({

	getInitialState () {
		return {
			inverted: TOGGLE_OPTIONS[0].value,
			value: ''
		};
	},

	toggleAllCheckboxes () {
		console.log('Toggle all checkboxes');
	},

	toggleInverted (value) {
		this.setState({
			inverted: value
		});
	},

	renderToggle () {
		return <SegmentedControl equalWidthSegments options={TOGGLE_OPTIONS} value={this.state.inverted} onChange={this.toggleInverted} />;
	},

	renderSelect () {
		return <div>react-select?</div>;
	},

	render () {
		return (
			<div>
				{this.renderToggle()}
				{this.renderSelect()}
			</div>
		);
	}

});

module.exports = RelationshipFilter;
