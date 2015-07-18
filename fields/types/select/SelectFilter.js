import _ from 'underscore';
import classNames from 'classnames';
import React from 'react';

import { Checkbox, FormField, SegmentedControl } from 'elemental';

var SelectFilter = React.createClass({

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
			{ label: 'Does Match', value: true },
			{ label: 'Does NOT Match', value: false }
		];

		return <SegmentedControl equalWidthSegments type="primary" options={options} value={this.state.inverted} onChange={this.toggleInverted} />;
	},

	renderCheckboxes () {
		let checkboxes = this.props.field.ops.map((opt) => {
			return <Checkbox label={opt.label} value={opt.label} />
		});

		checkboxes.unshift(<Checkbox onChange={this.toggleAllCheckboxes} label="Toggle all" />);

		return checkboxes;
	},

	render () {
		return (
			<div>
				{this.renderToggle()}
				{this.renderCheckboxes()}
			</div>
		);
	}

});

module.exports = SelectFilter;
