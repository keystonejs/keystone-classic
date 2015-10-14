import React from 'react';

import { FormField, FormInput, FormSelect, SegmentedControl } from 'elemental';

const TOGGLE_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true }
];

const MODE_OPTIONS = [
	{ label: 'Contains', value: 'contains' },
	{ label: 'Exactly', value: 'exactly' },
	{ label: 'Begins with', value: 'beginsWith' },
	{ label: 'Ends with', value: 'endsWith' }
];

function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		inverted: TOGGLE_OPTIONS[0].value,
		value: ''
	};
}

var TextFilter = React.createClass({

	statics: {
		getDefaultValue: getDefaultValue
	},

	propTypes: {
		filter: React.PropTypes.shape({
			mode: React.PropTypes.oneOf(MODE_OPTIONS.map(i => i.value)),
			inverted: React.PropTypes.boolean,
			value: React.PropTypes.string
		})
	},

	getDefaultProps () {
		return {
			filter: getDefaultValue()
		};
	},

	componentDidMount () {
		// focus the text focusTarget
		React.findDOMNode(this.refs.focusTarget).focus();
	},

	updateFilter (key, val) {
		var update = {};
		update[key] = val;
		this.props.onChange(Object.assign(this.props.filter, update));
	},

	selectMode (mode) {
		this.updateFilter('mode', mode);
		// focus the text input after a mode selection is made
		React.findDOMNode(this.refs.focusTarget).focus();
	},

	toggleInverted (value) {
		this.updateFilter('inverted', value);
	},

	updateValue (e) {
		this.updateFilter('value', e.target.value);
	},

	render () {
		let { field, filter } = this.props;
		var mode = MODE_OPTIONS.filter((i => i.value === filter.mode))[0];

		let placeholder = field.label + ' ' + mode.label.toLowerCase() + '...';

		return (
			<div>
				<FormField>
					<SegmentedControl equalWidthSegments options={TOGGLE_OPTIONS} value={filter.inverted} onChange={this.toggleInverted} />
				</FormField>
				<FormSelect options={MODE_OPTIONS} onChange={this.selectMode} value={mode.value} />
				<FormField>
					<FormInput focusOnMount ref="focusTarget" value={this.props.filter.value} onChange={this.updateValue} placeholder={placeholder} />
				</FormField>
			</div>
		);
	}

});

module.exports = TextFilter;
