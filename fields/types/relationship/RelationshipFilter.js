import _ from 'underscore';
import classNames from 'classnames';
import React from 'react';

import { Checkbox, FormField, SegmentedControl } from 'elemental';

var RelationshipFilter = React.createClass({

	getInitialState () {
		return {
			inverted: false,
			value: ''
		};
	},

	toggleAllCheckboxes () {
		console.log('Toggle all checkboxes')
	},

	toggleInverted (value) {
		this.setState({
			inverted: value
		});
	},

	renderToggle () {
		let options = [
			{ label: 'Linked To', value: true },
			{ label: 'NOT Linked To', value: false }
		];

		return <SegmentedControl equalWidthSegments type="primary" options={options} value={this.state.inverted} onChange={this.toggleInverted} />;
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
