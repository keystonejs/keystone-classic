import _ from 'underscore';
import classNames from 'classnames';
import React from 'react';

import { FormField, FormInput, FormSelect } from 'elemental';

const MODE_OPTIONS = [
	{ label: 'Matches',     value: 'matches' },
	{ label: 'Contains',    value: 'contains' },
	{ label: 'Begins with', value: 'beginsWith' },
	{ label: 'Ends with',   value: 'endsWith' }
];

var TextFilter = React.createClass({

	getInitialState () {
		return {
			mode: MODE_OPTIONS[0],
			value: ''
		};
	},

	componentDidMount () {
		// focus the text focusTarget
		React.findDOMNode(this.refs.focusTarget).focus();
	},

	toggleMode (mode) {
		this.setState({
			mode: mode
		});

		// focus the text focusTarget after a mode selection is made
		React.findDOMNode(this.refs.focusTarget).focus();
	},

	render () {
		let { field } = this.props;
		let { mode } = this.state;

		let placeholder = field.label + ' ' + mode.label.toLowerCase() + '...';

		return (
			<div>
				<FormSelect options={MODE_OPTIONS} onChange={this.toggleMode} value={mode.value} />
				<FormField>
					<FormInput ref="focusTarget" placeholder={placeholder} />
				</FormField>
			</div>
		);
	}

});

module.exports = TextFilter;
