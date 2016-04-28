import classNames from 'classnames';
import React from 'react';

import { SegmentedControl } from 'elemental';

var PasswordFilter = React.createClass({

	getInitialState () {
		return {
			checked: this.props.value || true,
		};
	},

	toggleChecked (checked) {
		this.setState({
			checked: checked,
		});
	},

	renderToggle () {
		const options = [
			{ label: 'Is Set', value: true },
			{ label: 'Is NOT Set', value: false },
		];

		return <SegmentedControl equalWidthSegments options={options} value={this.state.checked} onChange={this.toggleChecked} />;
	},

	render () {
		const { field } = this.props;
		const { checked } = this.state;

		return this.renderToggle();
	},

});

module.exports = PasswordFilter;
