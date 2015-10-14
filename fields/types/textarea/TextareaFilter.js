import _ from 'underscore';
import classNames from 'classnames';
import React from 'react';

import { FormField, FormInput, FormSelect } from 'elemental';

const CONTROL_OPTIONS = [
	{ label: 'Matches', value: 'matches' },
	{ label: 'Contains', value: 'contains' },
	{ label: 'Begins with', value: 'beginsWith' },
	{ label: 'Ends with', value: 'endsWith' },
	{ label: 'Is', value: 'is' },
	{ label: 'Is not', value: 'isNot' }
];

var TextareaFilter = React.createClass({

	getInitialState () {
		return {
			modeValue: CONTROL_OPTIONS[0].value, // 'matches'
			modeLabel: CONTROL_OPTIONS[0].label, // 'Matches'
			value: ''
		};
	},

	componentDidMount () {
		// focus the text input
		React.findDOMNode(this.refs.input).focus();
	},

	toggleMode (mode) {
		// TODO: implement w/o underscore
		this.setState({
			modeValue: mode,
			modeLabel: _.findWhere(CONTROL_OPTIONS, { value: mode }).label
		});

		// focus the text input after a mode selection is made
		React.findDOMNode(this.refs.input).focus();
	},

	renderMode () {
		// JM: this toggle looks good but is very limited
		// restricted to the width of the popup (wrapping looks terrible)
		// no support for multi selection
		// i've opted for a simple select
		// @jedwatson thoughts?

		let containClass = classNames('popout__toggle__action', { 'is-selected': this.state.mode === 'partial' });
		let matchClass = classNames('popout__toggle__action', { 'is-selected': this.state.mode === 'match' });

		return (
			<div className="popout__toggle">
				<span className="popout__toggle__item">
					<button type="button" onClick={() => { this.toggleMode('partial'); }} className={containClass}>Contains</button>
				</span>
				<span className="popout__toggle__item">
					<button type="button" onClick={() => { this.toggleMode('match'); }} className={matchClass}>Matches</button>
				</span>
			</div>
		);
	},

	render () {
		let { field } = this.props;
		let { modeLabel, modeValue } = this.state;

		let placeholder = field.label + ' ' + modeLabel.toLowerCase() + '...';

		return (
			<div>
				<FormSelect options={CONTROL_OPTIONS} onChange={this.toggleMode} value={modeValue} />
				<FormField>
					<FormInput ref="input" placeholder={placeholder} />
				</FormField>
			</div>
		);
	}

});

module.exports = TextareaFilter;
