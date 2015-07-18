import classNames from 'classnames';
import React from 'react';

import { FormField, FormInput } from 'elemental';

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

	renderToggle () {
		let { checked } = this.state;

		let isChecedClass = classNames('popout__toggle__action', { 'is-selected': checked });
		let isNotCheckedClass = classNames('popout__toggle__action', { 'is-selected': !checked });

		return (
			<div className="popout__toggle">
				<span className="popout__toggle__item">
					<button type="button" onClick={(e) => { this.toggleChecked(true); }} className={isChecedClass}>Is Checked</button>
				</span>
				<span className="popout__toggle__item">
					<button type="button" onClick={(e) => { this.toggleChecked(false); }} className={isNotCheckedClass}>Is NOT Checked</button>
				</span>
			</div>
		);
	},

	render () {
		let { field } = this.props;
		let { checked } = this.state;

		return this.renderToggle();
	}

});

module.exports = BooleanFilter;
